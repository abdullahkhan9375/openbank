import { createSlice } from '@reduxjs/toolkit';
import { isEmpty, isEqual } from 'lodash';
import { TBank } from '../model';

export const bankSlice = createSlice({
  name: 'bank',
  initialState: [{
    bankId: "",
    bankName: "",
    isPublic: false,
    tags: ["new"],
    questions: [],
    createdAt: "",
  }],
  reducers: {
    bankAdded(state, action)
    {
        const lBanks: TBank[] = state;
        const lNewBank: TBank = action.payload;
        const lExistsIndex = lBanks.findIndex((aBank: TBank) => aBank.bankId === lNewBank.bankId);
        if (lBanks[0] === undefined)
        {
            state.push(action.payload);
            return;
        }
        if (lBanks[0].bankName === "")
        {
            state[0] = action.payload;
            return;
        }
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
  }})

// Action creators are generated for each case reducer function
export const { bankAdded, bankDeleted } = bankSlice.actions;

export default bankSlice.reducer;