export interface BundlrConfig {
  currencyName: string;
  nodeUrl: string;
  providerUrl: string;
  currencyContractAddress: string;
}

export interface NetworkConfig {
  chainId: number;
  networkName: string;
  networkShortName: string;
  sarcoTokenAddress: string;
  diamondDeployAddress: string;
  bundlr: BundlrConfig;
}
