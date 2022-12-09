import { createSlice } from '@reduxjs/toolkit'
import { isEmpty, isEqual } from 'lodash';
import { TTest } from '../model';

export const testSlice = createSlice({
  name: 'test',
  initialState: [],
  reducers: {
    testAdded(state: TTest[], action)
    {
        const lTests: TTest[] = state;
        const lNewTest: TTest = action.payload;
        if (lTests.length === 0)
        {
            state.push(action.payload);
            return;
        }

        const lExistsIndex = lTests.findIndex((aTest: TTest) => aTest.id === lNewTest.id);
        if (lExistsIndex === -1)
        {
            state.push(action.payload);
        }
        else if (!isEqual(lTests[lExistsIndex], lNewTest))
        {
            state[lExistsIndex] = action.payload;
        }
    },
    testDeleted(state, action)
    {
        return state.filter((aTest: TTest) => aTest.id !== action.payload);
    }
  }});

// Action creators are generated for each case reducer function
export const { testAdded, testDeleted } = testSlice.actions

export default testSlice.reducer;
