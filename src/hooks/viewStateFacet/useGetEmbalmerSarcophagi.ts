import { useContractRead } from 'wagmi';
import { ViewStateFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useNetworkConfig } from 'lib/config';

export function useGetEmbalmerSarcophagi(embalmer: string) {
  const networkConfig = useNetworkConfig();

  const result = useContractRead({
    address: networkConfig.diamondDeployAddress,
    abi: ViewStateFacet__factory.abi,
    functionName: 'getEmbalmerSarcophagi',
    args: [embalmer],
  });

  return result;
}
