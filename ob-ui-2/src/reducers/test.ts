import { createSlice } from '@reduxjs/toolkit'
import { isEmpty, isEqual } from 'lodash';
import { TQuestion } from '../pages/Bank/QuestionDetails';
import { TTest } from '../pages/Test/ShowTests';

const lTestInitialState: TTest =
{
    id: "",
    name: "Sample test",
    createdAt: "",
    description: "It's a sample test!",
    tags: [],
    timeLimit: 30,
    questions: [],
    passingScore: 20,
}

export const testSlice = createSlice({
  name: 'test',
  initialState: [lTestInitialState],
  reducers: {
    testAdded(state, action)
    {
        const lTests: TTest[] = state;
        const lNewTest: TTest = action.payload;
        const lExistsIndex = lTests.findIndex((aTest: TTest) => aTest.id === lNewTest.id);
        if (lTests[0] === undefined)
        {
            state.push(action.payload);
            return;
        }
        if (lTests[0].id === "")
        {
            state[0] = action.payload;
            return;
        }
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
  }})

// Action creators are generated for each case reducer function
export const { testAdded, testDeleted } = testSlice.actions

export default testSlice.reducer;