import { BigNumber, ethers, utils } from 'ethers';
import { getLowestRewrapInterval } from '../../../../lib/utils/helpers';
import { Archaeologist, ArchaeologistEncryptedShard } from '../../../../types';
import { computeAddress } from 'ethers/lib/utils';
import { RecipientState } from '../../../../store/embalm/actions';

export interface ContractArchaeologist {
  archAddress: string;
  diggingFee: BigNumber;
  doubleHashedKeyShare: string;
  v: number;
  r: string;
  s: string;
}

export interface SubmitSarcophagusSettings {
  name: string;
  recipientAddress: string;
  resurrectionTime: number;
  threshold: number;
  creationTime: number;
  maximumRewrapInterval: number;
}

export interface SubmitSarcophagusProps {
  name: string;
  recipientState: RecipientState;
  resurrection: number;
  selectedArchaeologists: Archaeologist[];
  requiredArchaeologists: number;
  negotiationTimestamp: number;
  archaeologistSignatures: Map<string, string>;
  archaeologistShards: ArchaeologistEncryptedShard[];
  arweaveTxIds: string[];
}

export function formatSubmitSarcophagusArgs({
  name,
  recipientState,
  resurrection,
  selectedArchaeologists,
  requiredArchaeologists,
  negotiationTimestamp,
  archaeologistSignatures,
  archaeologistShards,
  arweaveTxIds,
}: SubmitSarcophagusProps) {
  const getContractArchaeologists = (): ContractArchaeologist[] => {
    return selectedArchaeologists.map(arch => {
      const { v, r, s } = ethers.utils.splitSignature(
        archaeologistSignatures.get(arch.profile.archAddress)!
      );
      return {
        archAddress: arch.profile.archAddress,
        diggingFee: arch.profile.minimumDiggingFee,
        doubleHashedKeyShare: archaeologistShards.filter(
          shard => shard.publicKey === arch.publicKey
        )[0].doubleHashedKeyShare,
        v,
        r,
        s,
      };
    });
  };

  const sarcoId = utils.id(name + Date.now().toString());
  const settings: SubmitSarcophagusSettings = {
    name,
    recipientAddress: recipientState.publicKey ? computeAddress(recipientState.publicKey) : '',
    resurrectionTime: Math.trunc(resurrection / 1000),
    threshold: requiredArchaeologists,
    creationTime: Math.trunc(negotiationTimestamp / 1000),
    maximumRewrapInterval: getLowestRewrapInterval(selectedArchaeologists),
  };

  const contractArchaeologists = getContractArchaeologists();

  const args = [
    sarcoId,
    {
      ...settings,
    },
    contractArchaeologists,
    arweaveTxIds,
  ];

  return { submitSarcophagusArgs: args };
}
