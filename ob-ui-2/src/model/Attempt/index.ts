import { TChoice } from "../Choice";
import { TQuestion } from "../Question";

export type TQuestionAttempt =
{
    question: TQuestion,
    selectedChoices: TChoice[],
    correct: boolean,
};

export type TExamAttempt =
{
    id: string,
    examId: string,
    testId: string,
    createdAt: number,
    results: TResult[],
};

export type TResult =
{
    status: string,
    score: number,
    pass: boolean,
    timeTaken: number,
    attempt: TQuestionAttempt[]
};
