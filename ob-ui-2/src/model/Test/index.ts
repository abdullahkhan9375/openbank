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
    questions: [],
} & TTestBase;

export type TTestView =
{
    numQuestions: number,
} & TTestBase;
