export interface BundlrConfig {
  currencyName: string;
  nodeUrl: string;
  providerUrl: string;
}

export interface NetworkConfig {
  chainId: number;
  networkName: string;
  networkShortName: string;
  sarcoTokenAddress: string;
  diamondDeployAddress: string;
  explorerUrl: string;
  explorerApiKey: string;
  bundlr: BundlrConfig;
}
