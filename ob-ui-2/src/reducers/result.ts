import { createSlice } from '@reduxjs/toolkit'
import { TExamAttempt } from '../model';

export type TExamAttemptState = { testId: string, attempts: TExamAttempt[]};

export const resultSlice = createSlice({
  name: 'result',
  initialState: [] as TExamAttemptState[],
  reducers: {
    resultAdded(state: TExamAttemptState[], action)
    {
        const lExamAttempt: TExamAttempt = action.payload;
        const lExamAttemptIndex = state.findIndex((aAttempt: TExamAttemptState) =>
          aAttempt.testId === lExamAttempt.testId);
        if (lExamAttemptIndex === -1)
        {
            state.push({ testId: lExamAttempt.testId, attempts: [action.payload]});
        }
        else
        {
            state[lExamAttemptIndex] = {...state[lExamAttemptIndex], attempts:
              [...new Set([...state[lExamAttemptIndex].attempts, action.payload])]};
        }
    }
  }});

// Action creators are generated for each case reducer function
export const { resultAdded } = resultSlice.actions;

export default resultSlice.reducer;
