import { createSlice } from '@reduxjs/toolkit';
import { isEmpty, isEqual } from 'lodash';
import { TBank } from '../model';

const lDummyBank: TBank[] =
[
  {
    id: "b-1",
    name: "Chemistry A-1",
    isPublic: true,
    tags: ["cool", "2022", "wow"],
    createdAt: "Today",
    numChoices: 2,
    questions:
    [
      {
        id: "b-1_q-1",
        name: "Question 1",
        statement: "What is chemistry about?",
        choices:
        [
          {
            id: 0,
            correct: true,
            body: "Studying maths",
            explanation: "This is the wrong choice.",
          },
          {
            id: 1,
            correct: false,
            body: "Studying change",
            explanation: "Nobody can explain it."
          },
        ],
      },
      {
        id: "b-1_q-2",
        name: "Question 2",
        statement: "What is Physics about?",
        choices:
        [
          {
            id: 0,
            correct: true,
            body: "Eienstein stuff",
            explanation: "This is the wrong choice.",
          },
          {
            id: 1,
            correct: true,
            body: "Studying the physical world!",
            explanation: "Nobody can explain it."
          },
        ],
      }
    ]
  },
  {
    id: "b-2",
    name: "Physics O-2",
    isPublic: true,
    tags: ["newp", "2021", "CIE"],
    createdAt: "Today",
    numChoices: 2,
    questions:
    [
      {
        id: "b-2_q-1",
        name: "Question 1",
        statement: "What is the meaning of life?",
        choices:
        [
          {
            id: 0,
            correct: true,
            body: "I don't really know",
            explanation: "This is the wrong choice.",
          },
          {
            id: 1,
            correct: false,
            body: "Making OpenBank!",
            explanation: "Nobody can explain it."
          },
        ],
      },
      {
        id: "b-2_q-2",
        name: "Question 2",
        statement: "What is computer science?",
        choices:
        [
          {
            id: 0,
            correct: true,
            body: "Sciency stuff",
            explanation: "This is regular daniel.",
          },
          {
            id: 1,
            correct: true,
            body: "Computer study lol.",
            explanation: "This is the cooler daniel."
          },
        ],
      }
    ]
  }
];

export const bankSlice = createSlice({
  name: 'bank',
  initialState: [...lDummyBank],
  reducers: {
    bankAdded(state: TBank[], action)
    {
        const lBanks: TBank[] = state;
        const lNewBank: TBank = action.payload;

        if (lBanks.length === 0)
        {
            state.push(action.payload);
            return;
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
    },
    bankDeleted(state, action)
    {
        return state.filter((aBank: TBank) => aBank.id !== action.payload);
    }
  }});

// Action creators are generated for each case reducer function
export const { bankAdded, bankDeleted } = bankSlice.actions;

export default bankSlice.reducer;
