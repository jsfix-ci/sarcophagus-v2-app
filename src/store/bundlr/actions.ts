import { WebBundlr } from '@bundlr-network/client';
import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  Connect = 'BUNDLR_CONNECT',
  Disconnect = 'BUNDLR_DISCONNECT',
  SetBundlr = 'BUNDLR_SET',
  SetBalance = 'EMBALM_SET_BALANCE',
  SetIsFunding = 'EMBALM_SET_IS_FUNDING',
  SetIsUploading = 'EMBALM_SET_IS_UPLOADING',
  SetTxId = 'BUNDLR_SET_TX_ID',
}

type BundlrPayload = {
  [ActionType.Connect]: {};
  [ActionType.Disconnect]: {};
  [ActionType.SetBundlr]: { bundlr: WebBundlr | null };
  [ActionType.SetBalance]: { balance: string };
  [ActionType.SetIsUploading]: { isUploading: boolean };
  [ActionType.SetIsFunding]: { isFunding: boolean };
  [ActionType.SetTxId]: { txId: string };
};

export function connect(): BundlrActions {
  return {
    type: ActionType.Connect,
    payload: {},
  };
}

export function disconnect(): BundlrActions {
  return {
    type: ActionType.Disconnect,
    payload: {},
  };
}

export function setBundlr(bundlr: WebBundlr | null): BundlrActions {
  return {
    type: ActionType.SetBundlr,
    payload: {
      bundlr,
    },
  };
}

export function setBalance(balance: string): BundlrActions {
  return {
    type: ActionType.SetBalance,
    payload: {
      balance,
    },
  };
}

export function setIsUploading(isUploading: boolean): BundlrActions {
  return {
    type: ActionType.SetIsUploading,
    payload: {
      isUploading,
    },
  };
}

export function setIsFunding(isFunding: boolean): BundlrActions {
  return {
    type: ActionType.SetIsFunding,
    payload: {
      isFunding,
    },
  };
}

export function setTxId(txId: string): BundlrActions {
  return {
    type: ActionType.SetTxId,
    payload: {
      txId,
    },
  };
}

export type BundlrActions = ActionMap<BundlrPayload>[keyof ActionMap<BundlrPayload>];
