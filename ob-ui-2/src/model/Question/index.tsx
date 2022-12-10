import { TChoice } from "../Choice";

export type TQuestion =
{
    id: string,
    name: string,
    statement: string,
    choices: TChoice[],
    correctChoices: number,
};

export type TQuestionError =
{
    invalidChoices: boolean,
    invalidStatement: boolean,
    invalidQty: boolean,
    invalidCorrect: boolean,
}