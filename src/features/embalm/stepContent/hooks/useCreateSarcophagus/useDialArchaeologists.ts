import { useCallback } from 'react';
import { setArchaeologistConnection, setArchaeologistException } from 'store/embalm/actions';
import { useDispatch, useSelector } from '../../../../../store';
import { ArchaeologistExceptionCode } from 'types';
import { useLibp2p } from '../../../../../hooks/libp2p/useLibp2p';
import { CreateSarcophagusStage } from '../../utils/createSarcophagus';
import { createSarcophagusErrors } from '../../utils/errors';

export function useDialArchaeologists() {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const { resetPublicKeyStream } = useLibp2p();
  const libp2pNode = useSelector(s => s.appState.libp2pNode);

  const dialSelectedArchaeologists = useCallback(async () => {
    await resetPublicKeyStream();

    const dialFailedArchaeologists = [];
    for await (const arch of selectedArchaeologists) {
      try {
        const connection = await libp2pNode?.dial(arch.fullPeerId!);
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(arch.profile.peerId, connection));
      } catch (e) {
        dispatch(
          setArchaeologistException(arch.profile.peerId, {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Could not establish a connection',
          })
        );
        dialFailedArchaeologists.push(arch.profile.peerId);
      }
    }

    if (dialFailedArchaeologists.length) {
      throw Error(createSarcophagusErrors[CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS]);
    }
  }, [selectedArchaeologists, libp2pNode, dispatch, resetPublicKeyStream]);

  return {
    dialSelectedArchaeologists,
  };
}
