import { createSlice } from '@reduxjs/toolkit'
import { isEmpty, isEqual } from 'lodash';
import { TBank } from '../pages/Bank/BankDetails'
import { TQuestion } from '../pages/Bank/QuestionDetails'

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
  }})

// Action creators are generated for each case reducer function
export const { bankAdded } = bankSlice.actions

export default bankSlice.reducer