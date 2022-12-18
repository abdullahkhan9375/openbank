import { TAttempt } from "../Attempt";
import { TQuestion } from "../Question";

type TTestBase =
{
    id: string,
    name: string,
    isPublic: boolean,
    createdAt: string,
    description: string,
    tags: string[],
    timeLimit: number,
    passingScore: number,
};

export type TTest =
{
    subscribedQuestions: TQuestion[],
} & TTestBase;

export type TTestView =
{
    numQuestions: number,
    status?: boolean,
    recentScore?: number,
    result: boolean,
    editable: boolean,
} & TTestBase;

export type TTestError =
{
    invalidName: boolean,
    invalidTimeLimit: boolean,
    invalidPassingScore: boolean,
    invalidNumQuestions: boolean,
};
