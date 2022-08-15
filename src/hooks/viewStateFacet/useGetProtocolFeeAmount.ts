import { useContractRead } from 'wagmi';
import { ViewStateFacet } from '../../abi/ViewStateFacet';

export function useGetProtocolFeeAmount() {
  const { data } = useContractRead({
    addressOrName: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || '',
    contractInterface: ViewStateFacet.abi,
    functionName: 'getProtocolFeeAmount',
  });

  return data;
}
