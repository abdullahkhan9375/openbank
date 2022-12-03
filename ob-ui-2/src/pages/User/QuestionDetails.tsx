import { FormEvent, useEffect, useState } from "react";
import { formDivClass, labelDivClass, labelText } from "./CommonStyling";
import { ChoiceDetails, TChoice } from "./ChoiceDetails";
import { textInputClass } from "./BankDetails";
import { actioButtonDisabledClass, actionButtonClass } from "../../common/buttons/styles";

export type TQuestion =
{
    id: string,
    statement: string,
    choices: TChoice[],
}

interface IQuestionDetailsProps
{
    question: TQuestion;
    onCancelSubmit: () => void;
    onSubmit: (aQuestion: TQuestion) => void;
}

type TQuestionError =
{
    invalidChoices: boolean,
    invalidStatement: boolean,
    invalidQty: boolean,
    invalidCorrect: boolean,
}

export const QuestionDetails = (aQuestionDetailsProps: IQuestionDetailsProps) =>
{
    const lQuestion = aQuestionDetailsProps.question;
    const [ question, setQuestion ] = useState<TQuestion>(lQuestion)
    const [ choiceQty, setChoiceQty ] = useState<number>(lQuestion.choices.length);
    const [ selectedChoice, setSelectedChoice ] = useState<TChoice>(lQuestion.choices[0]);
    const [ error, setError ] = useState<TQuestionError>(
        {
            invalidChoices: false,
            invalidStatement: true,
            invalidQty: false,
            invalidCorrect: false,
        }
    );

    useEffect(() =>
    {
        setQuestion(aQuestionDetailsProps.question);
    }, [aQuestionDetailsProps.question]);

    useEffect(() =>
    {
        const lBlankChoiceExists = question.choices.findIndex((aChoice: TChoice) => aChoice.body === "") !== -1;
        const lCorrectOptionDoesntExist = question.choices.findIndex((aChoice: TChoice) => aChoice.correct === true) === -1;

        setError({
            invalidQty: choiceQty === 0,
            invalidCorrect: lCorrectOptionDoesntExist,
            invalidStatement: question.statement === "",
            invalidChoices: question.choices.length === 0
                         || choiceQty !== question.choices.length
                         || lBlankChoiceExists
                });
    
        // console.log("Errors: ", error);
    }, [question, choiceQty])

    const handleSelectedChoice = (index: number) =>
    {
        const lIndex = question.choices.findIndex((aChoice: TChoice) =>
        {
            return aChoice.id === index
        });

        if (lIndex === -1)
        {
            setSelectedChoice({ id: index, body: "", correct: false, explanation: ""});
        } else
        {
            setSelectedChoice({...question.choices[lIndex]})
        }
    };

    const handleSubmit = (event: FormEvent) =>
    {
        event.preventDefault();

        const lEditedQuestion: TQuestion =
        {
            id: question.id,
            statement: question.statement,
            choices: question.choices,
        };

        aQuestionDetailsProps.onSubmit(lEditedQuestion);
    };

    const onChoiceSubmit = (aChoice: TChoice) =>
    {
        const lChoices: TChoice[] = question.choices;

        const choiceIndex: number = lChoices.findIndex((lChoice: TChoice) =>
        {
            return lChoice.id === aChoice.id
        });

        if (choiceIndex === -1)
        {
            setQuestion({ ...question, choices: [...question.choices, aChoice ]});
        } else
        {
            lChoices[choiceIndex] = aChoice;
            setQuestion({ ...question, choices: lChoices});
        }

        setSelectedChoice(aChoice);
    }

    const lError =     error.invalidChoices
                    || error.invalidCorrect
                    || error.invalidQty
                    || error.invalidStatement;

    return (
        <div className="container bg-gray-light flex flex-col mx-auto h-[33em] pt-3 px-[3em] mt-[10em] border-2">
            <form onSubmit={handleSubmit} action="">
                <div
                className="container flex flex-col h-full justify-around">
                    <div className={`${formDivClass} my-5 flex-col`}>
                        <div className={"container flex flex-col px-2 py-1 justify-between w-full"}>
                            <label className={labelText}> Question Statement </label>
                            <input type="text"
                                className={`${textInputClass} h-[5em] p-0 mt-2`}
                                value={question.statement}
                                onChange={(event) => setQuestion({ ...question, statement: event.target.value })}
                            />
                        </div>
                        <div className="container flex flex-row px-2 mt-3 w-2/5 justify-between">
                            <label className={labelText}> No. of Choices </label>
                            <input type="number" className={`${textInputClass} w-[5em] h-[2em]`} value={choiceQty} onChange={(event) => setChoiceQty(Number(event.target.value))}/>
                        </div>
                    </div>
                    <div className={formDivClass}>
                        <div className={`${textInputClass}container flex flex-col text-center pt-3 w-1/6 h-[197px] bg-white overflow-scroll`}>
                            {
                                Array(choiceQty).fill(0).map((_, index: number) =>
                                {
                                    return <a onClick={() => handleSelectedChoice(index)}> Choice #{index} </a>
                                })
                            }
                        </div>
                        <ChoiceDetails selectedChoice={selectedChoice} onSaveChoice={onChoiceSubmit}/>
                    </div>
                    <div className="container flex flex-row mx-auto mt-4 items-center justify-around w-[20em]">
                            <button className="border-0 bg-gray-light text-lg" onClick={aQuestionDetailsProps.onCancelSubmit}> Cancel </button>
                            <button type="submit"
                            className={`${lError ? actioButtonDisabledClass : actionButtonClass} w-[10em]`}> Submit </button>
                    </div>
                    <div className={`mx-auto text-red mt-2 ${lError ? "opacity-1": "opacity-0"}`}>
                     {lError && " You haven't saved all choices and/or typed a question statement and/or nominated a correct choice."}
                    </div>
                </div>
            </form>
        </div>
    )
}