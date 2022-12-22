import { TQuestion } from "../Question";

type TBankBase =
{
    id: string,
    name: string,
    description?: string,
    isPublic: boolean,
    tags: string[],
    createdAt: number,
};

export type TBank =
{
    numChoices: number,
    questions: TQuestion[],
} & TBankBase;

export type TBankView =
{
    numQuestions: number,
} & TBankBase;

export type TBankError =
{
    invalidName: boolean,
    invalidQuestion: boolean,
    emptyChoice: boolean,
};
