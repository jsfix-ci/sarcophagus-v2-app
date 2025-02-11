import { useCallback, useContext } from 'react';
import { encrypt, readFileDataAsBase64 } from '../../../../../lib/utils/helpers';
import useArweaveService from '../../../../../hooks/useArweaveService';
import { useSelector } from '../../../../../store';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';

export function useUploadDoubleEncryptedFile() {
  const { uploadToArweave } = useArweaveService();
  const { file, recipientState } = useSelector(x => x.embalmState);
  const { outerPublicKey, setSarcophagusPayloadTxId } = useContext(CreateSarcophagusContext);

  const uploadAndSetDoubleEncryptedFile = useCallback(async () => {
    try {
      const data = await readFileDataAsBase64(file!);
      const payload = {
        fileName: file?.name,
        data,
      };

      // Step 1: Encrypt the inner layer
      const encryptedInnerLayer = await encrypt(
        recipientState.publicKey,
        Buffer.from(JSON.stringify(payload))
      );

      // Step 2: Encrypt the outer layer
      const encryptedOuterLayer = await encrypt(outerPublicKey!, encryptedInnerLayer);

      // Step 3: Upload the double encrypted payload to arweave
      const payloadTxId = await uploadToArweave(encryptedOuterLayer);

      setSarcophagusPayloadTxId(payloadTxId);
    } catch (error: any) {
      throw new Error(error.message || 'Error uploading file payload to Bundlr');
    }
  }, [file, outerPublicKey, recipientState.publicKey, uploadToArweave, setSarcophagusPayloadTxId]);

  return {
    uploadAndSetDoubleEncryptedFile,
  };
}
