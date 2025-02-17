import { ArchaeologistEncryptedShard } from '../../../../types';
import { ethers } from 'ethers';
import { doubleHashShard, encrypt } from '../../../../lib/utils/helpers';

export async function encryptShards(
  publicKeys: string[],
  payload: Uint8Array[]
): Promise<ArchaeologistEncryptedShard[]> {
  return Promise.all(
    publicKeys.map(async (publicKey, i) => ({
      publicKey,
      encryptedShard: ethers.utils.hexlify(await encrypt(publicKey, Buffer.from(payload[i]))),
      doubleHashedKeyShare: doubleHashShard(payload[i]),
    }))
  );
}

// Note: ORDER MATTERS HERE
export enum CreateSarcophagusStage {
  NOT_STARTED,
  DIAL_ARCHAEOLOGISTS,
  GET_PUBLIC_KEYS,
  UPLOAD_ENCRYPTED_SHARDS,
  ARCHAEOLOGIST_NEGOTIATION,
  UPLOAD_PAYLOAD,
  APPROVE,
  SUBMIT_SARCOPHAGUS,
  CLEAR_STATE,
  COMPLETED,
}

export const defaultCreateSarcophagusStages: Record<number, string> = {
  [CreateSarcophagusStage.NOT_STARTED]: '',
  [CreateSarcophagusStage.DIAL_ARCHAEOLOGISTS]: 'Connect to Archaeologists',
  [CreateSarcophagusStage.GET_PUBLIC_KEYS]: 'Request Archaeologist Public Keys',
  [CreateSarcophagusStage.UPLOAD_ENCRYPTED_SHARDS]: 'Upload Archaeologist Data to Arweave',
  [CreateSarcophagusStage.ARCHAEOLOGIST_NEGOTIATION]: 'Retrieve Archaeologist Signatures',
  [CreateSarcophagusStage.UPLOAD_PAYLOAD]: 'Upload File Data to Arweave',
  [CreateSarcophagusStage.APPROVE]: 'Approve',
  [CreateSarcophagusStage.SUBMIT_SARCOPHAGUS]: 'Create Sarcophagus',
  [CreateSarcophagusStage.CLEAR_STATE]: '',
  [CreateSarcophagusStage.COMPLETED]: '',
};
