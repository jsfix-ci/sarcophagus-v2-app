import { useContractRead } from 'wagmi';
import { ViewStateFacetABI } from '../../abis/ViewStateFacet';

export function useGetAvailableRewards({ archaeologist }: { archaeologist: string }) {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacetABI,
    functionName: 'getAvailableRewards',
    args: [archaeologist],
  });

  return { embalmerSarcophagi: data };
}
