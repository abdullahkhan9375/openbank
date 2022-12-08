import { configureStore } from '@reduxjs/toolkit'
import bankSlice from "../reducers/bank";
import  testSlice from '../reducers/test';

const reducer =
{
  bank: bankSlice,
  test: testSlice,
};

export default configureStore({
  reducer: reducer,
});

