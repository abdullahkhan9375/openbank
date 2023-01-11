import { createSlice } from '@reduxjs/toolkit';
import { Cache } from 'aws-amplify';

export type TGlobalState =
{
    user: {
      userId: string,
      lastName: string, 
      isSignedIn: boolean }
};

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    user: {
        userId: Cache.getItem("userId"),
        lastName: Cache.getItem("lastName"),
        isSignedIn: localStorage.getItem("amplify-auto-sign-in") ?? false,
      },
    },
  reducers: {
    userSignedInStatusChange(state: any, action)
    {
        Cache.setItem("isSignedIn", action.payload.isSignedIn);
        Cache.setItem("userId", action.payload.userId);
        Cache.setItem("lastName", action.payload.lastName);
        state.user.userId = action.payload.userId;
        state.user.lastName = action.payload.lastName;
        state.user.isSignedIn = action.payload.isSignedIn;

        if (!action.payload.isSignedIn)
        {
          Cache.setItem("getBanksCalled", false);
        }
    },
}});

// Action creators are generated for each case reducer function
export const { userSignedInStatusChange } = globalSlice.actions;

export default globalSlice.reducer;
