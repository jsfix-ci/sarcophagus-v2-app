import { ethers, UnsignedTransaction } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
import { useState } from 'react';
import axios from 'axios';
import { useProvider, useNetwork } from 'wagmi';
import { useDispatch, useSelector } from 'store/index';

export enum LookupPublicKeyStatus {
  SUCCESS,
  ERROR,
  NO_TRANSACTIONS,
  LOADING,
  INVALID_ADDRESS,
  WRONG_NETWORK,
  NOT_CONNECTED,
}

const etherscanEndpoint = 'https://api.etherscan.io/api';
const etherscanApikey = process.env.REACT_APP_ETHERSCAN_APIKEY;
const getParameters =
  'module=account&action=txlist&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc';

export function useLookupPublicKey() {
  const dispatch = useDispatch();
  const publicKey = useSelector(x => x.bundlrState.bundlr);

  const [lookupStatus, setLookupStatus] = useState<LookupPublicKeyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const provider = useProvider();
  const { chain } = useNetwork();

  async function lookupPublicKey(address: string) {
    try {
      setIsLoading(true);
      //    setLookupStatus(LookupPublicKeyStatus.LOADING);
      if (!ethers.utils.isAddress(address)) {
        setLookupStatus(LookupPublicKeyStatus.INVALID_ADDRESS);
      } else if (chain) {
        if (chain.id !== 1) {
          setLookupStatus(LookupPublicKeyStatus.WRONG_NETWORK);
          return;
        }
      } else {
        setLookupStatus(LookupPublicKeyStatus.NOT_CONNECTED);
        return;
      }

      const response = await axios.get(
        `${etherscanEndpoint}?${getParameters}&address=${address}&apikey=${etherscanApikey}`
      );

      const status = response.data.status;
      if (status !== '1') {
        //TODO: throw error here
        setLookupStatus(LookupPublicKeyStatus.ERROR);
        return;
      }

      for (let index = 0; index < response.data.result.length; index++) {
        const transaction = await provider.getTransaction(response.data.result[index].hash);

        //we can only resolve a public key when the 'from' transaction matches the given address
        if (transaction.from.toLowerCase() === address.toLowerCase()) {
          const unsignedTransaction: UnsignedTransaction = {
            type: transaction.type,
            nonce: transaction.nonce,
            gasLimit: transaction.gasLimit,
            to: transaction.to,
            value: transaction.value,
            data: transaction.data,

            ...(transaction.chainId && { chainId: transaction.chainId }),

            ...((transaction.type === 0 || transaction.type === 1 || !transaction.type) && {
              gasPrice: transaction.gasPrice,
            }),

            ...((transaction.type === 1 || transaction.type === 2) && {
              accessList: transaction.accessList,
            }),

            ...(transaction.type === 2 && {
              maxFeePerGas: transaction.maxFeePerGas,
              maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
            }),
          };

          const resolvedTx = await ethers.utils.resolveProperties(unsignedTransaction);
          const rawTx = ethers.utils.serializeTransaction(resolvedTx);
          const msgHash = ethers.utils.keccak256(rawTx);

          const signature = ethers.utils.splitSignature({
            r: transaction.r || '',
            s: transaction.s || '',
            v: transaction.v || 0,
          });

          const publicKey = ethers.utils.recoverPublicKey(msgHash, signature);

          if (ethers.utils.computeAddress(publicKey).toLowerCase() == address.toLowerCase()) {
            setLookupStatus(LookupPublicKeyStatus.SUCCESS);
            dispatch(setPublicKey(publicKey));
            return;
          }
        }
      }

      setLookupStatus(LookupPublicKeyStatus.NO_TRANSACTIONS);
      return;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return { lookupStatus, lookupPublicKey, isLoading };
}
