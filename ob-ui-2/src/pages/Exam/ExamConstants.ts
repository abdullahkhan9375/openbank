import { TExam, TExamAttempt, TQuestion, TResult } from "../../model";
import { v4 as uuidv4 } from "uuid";

export const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

export const lEmptyQuestion: TQuestion =
{
    id: "",
    name: "",
    statement: "",
    correctChoices: 0,
    choices: [ { id: 0, correct: false, body: ""}]
};

export const lNewExam: TExam =
{
    id: uuidv4(),
    testConfig:
    {
        id: "",
        name: "",
        isPublic: false,
        createdAt: 0,
        description: "",
        tags: [],
        timeLimit: 0,
        passingScore: 0,
        subscribedQuestions: [lEmptyQuestion],
    },
};

export const lResult: TResult =
{
    status: "INCOMPLETE",
    score: 0,
    pass: false,
    timeTaken: -1,
    attempt: [],
};

export const lEmptyExamAttempt: TExamAttempt =
{
    id: uuidv4(),
    testId: lNewExam.testConfig.id,
    examId: lNewExam.id,
    createdAt: 0,
    results: [],
};
