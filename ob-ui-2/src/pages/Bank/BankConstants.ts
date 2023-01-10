import { TBank, TChoice } from "../../model";

export const lEmptyBank: TBank =
{
    id: "",
    name: "",
    type: "bank",
    isPublic: false,
    lastUpdated: 0,
    tags: [],
    numChoices: 1,
    questions: [],
    createdAt: 0,
};

export const lEmptyChoice: TChoice =
{
    id: 0,
    body: "",
    correct: false,
    explanation: "",
};
