import { configureStore } from '@reduxjs/toolkit'
import bankSlice from "../reducers/bank";
import resultSlice from '../reducers/result';
import  testSlice from '../reducers/test';

const reducer =
{
  bank: bankSlice,
  test: testSlice,
  result: resultSlice,
};

export default configureStore({
  reducer: reducer,
});

