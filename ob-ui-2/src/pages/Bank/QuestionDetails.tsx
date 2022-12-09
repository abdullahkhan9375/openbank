import { FormEvent, useEffect, useState } from "react";
import { formDivClass, labelDivClass, labelText, textInputClass } from "../../common/CommonStyling";
import { actioButtonDisabledClass, actionButtonClass } from "../../common/buttons/styles";
import { TChoice, TQuestion, TQuestionError } from "../../model";
import { ChoiceDetails } from "./ChoiceDetails";


interface IQuestionDetailsProps
{
    question: TQuestion;
    numChoices: number;
    onCancelSubmit: () => void;
    onSubmit: (aQuestion: TQuestion) => void;
}


export const QuestionDetails = (aQuestionDetailsProps: IQuestionDetailsProps) =>
{
    const lQuestion = aQuestionDetailsProps.question;
    const [ question, setQuestion ] = useState<TQuestion>(lQuestion)
    const [ choiceQty, setChoiceQty ] = useState<number>(aQuestionDetailsProps.numChoices);
    const [ selectedChoice, setSelectedChoice ] = useState<TChoice>(lQuestion.choices[0]);
    const [ error, setError ] = useState<TQuestionError>(
        {
            invalidChoices: false,
            invalidStatement: true,
            invalidQty: false,
            invalidCorrect: false,
        }
    );

    const lError: boolean =  error.invalidChoices
                    || error.invalidCorrect
                    || error.invalidQty
                    || error.invalidStatement;

    useEffect(() =>
    {
        setQuestion(aQuestionDetailsProps.question);
        setChoiceQty(aQuestionDetailsProps.numChoices);
    }, [aQuestionDetailsProps]);

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

        if (lError) { return; }
        const lEditedQuestion: TQuestion =
        {
            id: question.id,
            name: question.name,
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

    return (
        <div className="container bg-gray-light flex flex-col mx-auto h-[33em] pt-3 px-[3em] border-2">
            <form onSubmit={handleSubmit} action="">
                <div
                className="container flex flex-col h-full justify-around">
                    <div className={`${formDivClass} my-5 flex-col`}>
                        <div className={"container flex flex-row px-2 justify-between w-full"}>
                                <label className={labelText}> Name </label>
                                <input type="text"
                                    className={`${textInputClass} p-0 mt-2`}
                                    value={question.name}
                                    onChange={(event) => setQuestion({ ...question, name: event.target.value })}
                                />
                            </div>
                        <div className={"container flex flex-row px-2 justify-between w-full"}>
                            <label className={labelText}> Question Statement </label>
                            <input type="text"
                                className={`${textInputClass} w-[40em] h-[5em] p-0 mt-2`}
                                value={question.statement}
                                onChange={(event) => setQuestion({ ...question, statement: event.target.value })}
                            />
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