import { TChoice } from "../Choice";

export type TAttempt =
{
    questionId: string,
    selectedChoices: TChoice[],
    correct: boolean,
};

export type TExamAttempt =
{
    id: string,
    examId: string,
    testId: string,
    createdAt: number,
    attempt: TAttempt[],
    result: TResult,
};

export type TResult =
{
    status: string,
    score: number,
    pass: boolean,
    timeTaken: number,
};
