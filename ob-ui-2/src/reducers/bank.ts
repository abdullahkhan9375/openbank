import { createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash';
import { TBank } from '../pages/Bank/BankDetails'
import { TQuestion } from '../pages/Bank/QuestionDetails'

export const bankSlice = createSlice({
  name: 'bank',
  initialState: [{
    bankName: "",
    isPublic: false,
    tags: [],
    questions: [],
    createdAt: "",
  }],
  reducers: {
    bankAdded(state, action)
    {
        if (state[0].bankName === "")
        {
            state[0] = action.payload;
        }
        else
        {
            state.push(action.payload);
        }
    },
  }})

// Action creators are generated for each case reducer function
export const { bankAdded } = bankSlice.actions

export default bankSlice.reducer