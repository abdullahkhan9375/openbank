import { configureStore } from '@reduxjs/toolkit'
import bankSlice from "../reducers/bank";
import globalSlice from '../reducers/global';
import resultSlice from '../reducers/result';
import  testSlice from '../reducers/test';

const reducer =
{
  bank: bankSlice,
  test: testSlice,
  result: resultSlice,
  global: globalSlice,
};

export default configureStore({
  reducer: reducer,
});
