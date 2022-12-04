import { configureStore } from '@reduxjs/toolkit'
import bankSlice from "../reducers/bank";

export default configureStore({
  reducer: {
    bank: bankSlice
  },
});
