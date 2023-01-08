import { createSlice } from '@reduxjs/toolkit';
import { Cache } from 'aws-amplify';

export type TGlobalState =
{
    user: { isSignedIn: boolean }
};

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    user: {
        isSignedIn: Cache.getItem("isSignedIn") !== null
      },
    },
  reducers: {
    userSignedInStatusChange(state: any, action)
    {
        Cache.setItem("isSignedIn", action.payload);
        state.user.isSignedIn = action.payload;
    },
}});

// Action creators are generated for each case reducer function
export const { userSignedInStatusChange } = globalSlice.actions;

export default globalSlice.reducer;
