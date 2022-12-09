import { createSlice } from '@reduxjs/toolkit';
import { isEmpty, isEqual } from 'lodash';
import { TBank } from '../model';

export const bankSlice = createSlice({
  name: 'bank',
  initialState: [],
  reducers: {
    bankAdded(state: TBank[], action)
    {
        const lBanks: TBank[] = state;
        const lNewBank: TBank = action.payload;

        if (lBanks.length === 0)
        {
            state.push(action.payload);
            return;
        }

        const lExistsIndex = lBanks.findIndex((aBank: TBank) => aBank.bankId === lNewBank.bankId);
        if (lExistsIndex === -1)
        {
            state.push(action.payload);
        }
        else if (!isEqual(lBanks[lExistsIndex], lNewBank))
        {
            state[lExistsIndex] = action.payload;
        }
    },
    bankDeleted(state, action)
    {
        return state.filter((aBank: TBank) => aBank.bankId !== action.payload);
    }
  }});

// Action creators are generated for each case reducer function
export const { bankAdded, bankDeleted } = bankSlice.actions;

export default bankSlice.reducer;
