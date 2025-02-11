import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import { disableSteps } from 'store/embalm/actions';
import { useArchaeologistSignatureNegotiation } from 'features/embalm/stepContent/hooks/useCreateSarcophagus/useArchaeologistSignatureNegotiation';
import { CreateSarcophagusStage } from '../../utils/createSarcophagus';
import { ethers } from 'ethers';
import { formatCreateSarcophagusError } from '../../utils/errors';
import { useDialArchaeologists } from './useDialArchaeologists';
import { useUploadEncryptedShards } from './useUploadEncryptedShards';
import { useUploadDoubleEncryptedFile } from './useUploadDoubleEncryptedFile';
import { useApproveSarcoToken } from './useApproveSarcoToken';
import { useSubmitSarcophagus } from './useSubmitSarcophagus';
import { useClearSarcophagusState } from './useClearSarcophagusState';
import { useRequestPublicKeys } from './useRequestPublicKeys';

export function useCreateSarcophagus(
  createSarcophagusStages: Record<number, string>,
  embalmerFacet: ethers.Contract,
  sarcoToken: ethers.Contract
) {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(x => x.embalmState);

  // State variables to track sarcophagus creation flow across all stages
  const [currentStage, setCurrentStage] = useState(CreateSarcophagusStage.NOT_STARTED);
  const [stageExecuting, setStageExecuting] = useState(false);
  const [stageError, setStageError] = useState<string>();
  const [isStageRetry, setIsStageRetry] = useState(false);

  // Returns true when all public keys have been received from archaoelogists

  // Each hook represents a stage in the create sarcophagus process
  const { dialSelectedArchaeologists } = useDialArchaeologists();
  const { requestPublicKeys } = useRequestPublicKeys();
  const { uploadAndSetEncryptedShards } = useUploadEncryptedShards();
  const { initiateSarcophagusNegotiation } = useArchaeologistSignatureNegotiation();
  const { uploadAndSetDoubleEncryptedFile } = useUploadDoubleEncryptedFile();
  const { approveSarcoToken } = useApproveSarcoToken(sarcoToken);
  const { submitSarcophagus } = useSubmitSarcophagus(embalmerFacet);
  const { clearSarcophagusState, successData } = useClearSarcophagusState();

  const stagesMap = useMemo(() => {
    return new Map<CreateSarcophagusStage, (...args: any[]) => Promise<any>>([
      [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS, dialSelectedArchaeologists],
      [CreateSarcophagusStage.GET_PUBLIC_KEYS, requestPublicKeys],
      [CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS, uploadAndSetEncryptedShards],
      [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION, initiateSarcophagusNegotiation],
      [CreateSarcophagusStage.UPLOAD_PAYLOAD, uploadAndSetDoubleEncryptedFile],
      [CreateSarcophagusStage.APPROVE, approveSarcoToken],
      [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS, submitSarcophagus],
      [CreateSarcophagusStage.CLEAR_STATE, clearSarcophagusState],
      [CreateSarcophagusStage.COMPLETED, async () => {}],
    ]);
  }, [
    dialSelectedArchaeologists,
    requestPublicKeys,
    uploadAndSetEncryptedShards,
    initiateSarcophagusNegotiation,
    uploadAndSetDoubleEncryptedFile,
    approveSarcoToken,
    submitSarcophagus,
    clearSarcophagusState,
  ]);

  // Process each stage as they become active
  useEffect(() => {
    (async () => {
      const incrementStage = (): void => {
        if (currentStage === CreateSarcophagusStage.COMPLETED) {
          return;
        }
        const stages = Object.keys(createSarcophagusStages).map(i => Number.parseInt(i));
        const currentIndex = stages.indexOf(currentStage);
        setCurrentStage(stages[currentIndex + 1]);
      };

      const executeStage = async (
        stageToExecute: (_: boolean) => Promise<any>,
        isRetry: boolean
      ): Promise<any> =>
        new Promise((resolve, reject) => {
          setStageExecuting(true);

          stageToExecute(isRetry)
            .then((result: any) => {
              // Add a slight delay before next step
              // to account for any global dispatch delay
              setTimeout(() => {
                setStageExecuting(false);
                setIsStageRetry(false);
                incrementStage();
                resolve(result);
              }, 1000);
            })
            .catch((error: any) => {
              reject(error);
              setStageExecuting(false);
              setIsStageRetry(false);
            });
        });

      if (!stageExecuting && !stageError && currentStage !== CreateSarcophagusStage.COMPLETED) {
        try {
          const currentStageFunction = stagesMap.get(currentStage);
          if (currentStageFunction) {
            await executeStage(currentStageFunction, isStageRetry);
          }
        } catch (error: any) {
          console.error(error);
          const stageErrorMessage = formatCreateSarcophagusError(
            currentStage,
            error,
            selectedArchaeologists
          );
          setStageError(stageErrorMessage);
        }
      }
    })();
  }, [
    currentStage,
    stageExecuting,
    stagesMap,
    stageError,
    isStageRetry,
    dispatch,
    createSarcophagusStages,
    selectedArchaeologists,
  ]);

  const retryStage = useCallback(async () => {
    setStageError(undefined);
    setIsStageRetry(true);
  }, []);

  const handleCreate = useCallback(async () => {
    setCurrentStage(CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS);
    setStageError(undefined);
    setIsStageRetry(false);
    dispatch(disableSteps());
  }, [dispatch]);

  return {
    currentStage,
    handleCreate,
    stageError,
    retryStage,
    successData,
    clearSarcophagusState,
  };
}
