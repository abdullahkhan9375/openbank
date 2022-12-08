import { TQuestion } from "../Question";

type TBankBase =
{
    bankId: string,
    bankName: string,
    isPublic: boolean,
    tags: string[],
    createdAt: string,
};

export type TBank =
{
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
};