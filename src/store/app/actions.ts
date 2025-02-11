import { ActionMap } from '../ActionMap';
import { Libp2p } from 'libp2p';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  StartLoad = 'APP_START_LOAD',
  StopLoad = 'APP_STOP_LOAD',
  SetLibP2p = 'APP_SET_LIBP2P',
}

type AppPayload = {
  [ActionType.StartLoad]: {
    isLoading: boolean;
  };
  [ActionType.StopLoad]: {
    isLoading: boolean;
  };
  [ActionType.SetLibP2p]: {
    libp2pNode: Libp2p;
  };
};

export function startLoad(): AppActions {
  return {
    type: ActionType.StartLoad,
    payload: {
      isLoading: true,
    },
  };
}

export function stopLoad(): AppActions {
  return {
    type: ActionType.StopLoad,
    payload: {
      isLoading: false,
    },
  };
}

export function setLibp2p(libp2pNode: Libp2p): AppActions {
  return {
    type: ActionType.SetLibP2p,
    payload: {
      libp2pNode,
    },
  };
}

export type AppActions = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];
