import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API } from 'aws-amplify';
import { isEqual } from 'lodash';
import { TBank, TDeleteBankRequest, TGetBankRequest, TPostBankRequest } from '../model';

// const lDummyBank: TBank[] =
// [
//   {
//     id: "b-1",
//     name: "Chemistry A-1",
//     isPublic: true,
//     type: "bank",
//     tags: ["cool", "2022", "wow"],
//     createdAt: Date.now(),
//     numChoices: 2,
//     questions:
//     [
//       {
//         id: "b-1_q-1",
//         name: "Question 1",
//         type: "question",
//         statement: "What is chemistry about?",
//         correctChoices: 1,
//         choices:
//         [
//           {
//             id: 0,
//             correct: false,
//             body: "Studying maths",
//             explanation: "This is the wrong choice.",
//           },
//           {
//             id: 1,
//             correct: true,
//             body: "Studying change",
//             explanation: "Nobody can explain it."
//           },
//         ],
//       },
//       {
//         id: "b-1_q-2",
//         name: "Question 2",
//         type: "question",
//         statement: "What is Physics about?",
//         correctChoices: 1,
//         choices:
//         [
//           {
//             id: 0,
//             correct: false,
//             body: "Eienstein stuff",
//             explanation: "This is the wrong choice.",
//           },
//           {
//             id: 1,
//             correct: true,
//             body: "Studying the physical world!",
//             explanation: "Nobody can explain it."
//           },
          
//         ],
//       }
//     ]
//   },
//   {
//     id: "b-2",
//     name: "Physics O-2",
//     isPublic: true,
//     tags: ["newp", "2021", "CIE"],
//     createdAt: Date.now(),
//     numChoices: 2,
//     type: "bank",
//     questions:
//     [
//       {
//         id: "b-2_q-1",
//         name: "Question 1",
//         type: "question",
//         statement: "What is the meaning of life?",
//         correctChoices: 1,
//         choices:
//         [
//           {
//             id: 0,
//             correct: true,
//             body: "I don't really know",
//             explanation: "This is the wrong choice.",
//           },
//           {
//             id: 1,
//             correct: false,
//             body: "Making OpenBank!",
//             explanation: "Nobody can explain it."
//           },
//         ],
//       },
//       {
//         id: "b-2_q-2",
//         name: "Question 2",
//         type: "question",
//         statement: "What is computer science?",
//         correctChoices: 1,
//         choices:
//         [
//           {
//             id: 0,
//             correct: false,
//             body: "Sciency stuff",
//             explanation: "This is regular daniel.",
//           },
//           {
//             id: 1,
//             correct: true,
//             body: "Computer study lol.",
//             explanation: "This is the cooler daniel."
//           },
//         ],
//       },
//       {
//         id: "b-2_q-3",
//         name: "Question 3",
//         type: "question",
//         statement: "Both of the choices should be correct!",
//         correctChoices: 2,
//         choices:
//         [
//           {
//             id: 0,
//             correct: true,
//             body: "Correct choice",
//             explanation: "This is regular daniel.",
//           },
//           {
//             id: 1,
//             correct: true,
//             body: "Another correct choice!",
//             explanation: "This is the cooler daniel."
//           },
//           {
//             id: 2,
//             correct: false,
//             body: "The wrong choice lol.",
//             explanation: "This is the cooler daniel."
//           },
//         ],
//       }
//     ]
//   }
// ];

// First, create the thunk
export const getBanksForUser = createAsyncThunk(
  'users/getBanksForUser',
  async (aGetBankRequest: TGetBankRequest, thunkAPI) => {
    const apiName = 'openbank';
        const path = `/bank`;
        const lReqUser = {
            headers: {}, // OPTIONAL
            body:
            {
              userId: aGetBankRequest.userId,
              page: aGetBankRequest.page,
            }
        };
    const response = await API.post(apiName, path, lReqUser);
    return response.data;
  }
);

export const postBankForUser = createAsyncThunk(
  'users/postBankForUser',
  async (aPostBankRequest: TPostBankRequest, thunkAPI) => {
    const apiName = 'openbank';
        const path = `/bank/new`;
        const lReqUser = {
            headers: {}, // OPTIONAL
            body:
            {
              ...aPostBankRequest,
            },
        };
    const response = await API.post(apiName, path, lReqUser);
    // console.log(response);
    return response.body;
  }
);

export const deleteBankForUser = createAsyncThunk(
  'users/deleteBankForUser',
  async (aDeleteBankRequest: TDeleteBankRequest, thunkAPI) => {
    const apiName = 'openbank';
        const path = `/bank/delete`;
        const lReqUser = {
            headers: {}, // OPTIONAL
            body:
            {
              userId: aDeleteBankRequest.userId,
              bankId: aDeleteBankRequest.bankId,
            },
        };
    const response = await API.post(apiName, path, lReqUser);
    return response.body;
  }
);

export const bankSlice = createSlice({
  name: 'bank',
  initialState: [] as TBank[],
  reducers: {
    bankDeleted(state, action)
    {
        return state.filter((aBank: TBank) => aBank.id !== action.payload);
    },
    clearBankState(state)
    {
      state = [];
      return state;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getBanksForUser.fulfilled, (state, action) =>
    {
      return state = action.payload;
    }),
    builder.addCase(postBankForUser.fulfilled, (state, action) =>
    {
        const lBanks: TBank[] = state;
        const lNewBank: TBank = action.payload;

        if (lBanks.length === 0)
        {
          state.push(action.payload);
        }

        const lExistsIndex = lBanks.findIndex((aBank: TBank) => aBank.id === lNewBank.id);
        if (lExistsIndex === -1)
        {
          state.push(action.payload);
        }
        else if (!isEqual(lBanks[lExistsIndex], lNewBank))
        {
          state[lExistsIndex] = action.payload;
        }
    }),
    builder.addCase(deleteBankForUser.fulfilled, (state, action) =>
    {
      return state.filter((aBank: TBank) => aBank.id !== action.payload)
    })
  },
});

// Action creators are generated for each case reducer function
export const { clearBankState } = bankSlice.actions;

export default bankSlice.reducer;
