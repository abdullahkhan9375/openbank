import { TChoice } from "../Choice";

export type TQuestion =
{
    id: string,
    name: string,
    bankId: string,
    type: "question",
    statement: string,
    choices: TChoice[],
    correctChoices: number,
};

export type TQuestionError =
{
    invalidName: boolean,
    invalidChoices: boolean,
    invalidStatement: boolean,
    invalidCorrect: boolean,
};
