import { Actions } from '..';
import { Archaeologist } from '../../types';
import { ActionType } from './actions';

export interface ArchaeologistState {
  archaeologists: Archaeologist[];
}

export const archaeologistInitialState: ArchaeologistState = {
  archaeologists: [],
};

export const archaeologistReducer = (state: ArchaeologistState, action: Actions) => {
  switch (action.type) {
    case ActionType.StoreArchaeologists:
      const archaeologists = action.payload.archaeologists;
      return { ...state, archaeologists };

    default:
      return state;
  }
};
