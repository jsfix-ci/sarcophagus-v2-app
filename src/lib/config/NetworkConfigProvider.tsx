import { NetworkConfigContext } from '.';
import { useNetwork } from 'wagmi';
import { networkConfigs } from './networkConfig';
import { NetworkConfig } from './networkConfigType';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();
  const networkConfig: NetworkConfig = !!chain
    ? networkConfigs[chain.id]
    : // fallback to empty config if there is no connected wallet
      {
        chainId: 0,
        networkName: '',
        networkShortName: '',
        sarcoTokenAddress: '',
        diamondDeployAddress: '',
        etherscanApiUrl: '',
        etherscanApiKey: '',
        explorerUrl: '',
        bundlr: {
          currencyName: '',
          nodeUrl: '',
          providerUrl: '',
        },
        arweaveConfig: {
          host: '',
          port: 0,
          protocol: 'https',
          timeout: 0,
          logging: false,
        },
      };

  return (
    <NetworkConfigContext.Provider value={networkConfig}>{children}</NetworkConfigContext.Provider>
  );
}
