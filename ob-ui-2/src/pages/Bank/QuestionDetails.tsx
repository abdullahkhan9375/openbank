import { useEffect, useMemo, useState } from "react";
import { flexColClass, flexRowClass, formDivClass, labelTextClass, textInputClass } from "../../common/CommonStyling";
import { actioButtonDisabledClass, actionButtonClass } from "../../common/buttons/styles";
import { TChoice, TQuestion, TQuestionError } from "../../model";
import { ChoiceDetails } from "./ChoiceDetails";
import { isEqual } from "lodash";

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

    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);
    const [ hasChanged, setHasChanged ] = useState<boolean>(false);
    const [ error, setError ] = useState<TQuestionError>(
        {
            invalidName: true,
            invalidChoices: false,
            invalidStatement: true,
            invalidQty: false,
            invalidCorrect: false,
        }
    );

    const lError: boolean =  error.invalidChoices
                          || error.invalidCorrect
                          || error.invalidQty
                          || error.invalidStatement
                          || error.invalidName
                          || !hasChanged;

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
            invalidName: question.name === "",
            invalidQty: choiceQty === 0,
            invalidCorrect: lCorrectOptionDoesntExist,
            invalidStatement: question.statement === "",
            invalidChoices: question.choices.length === 0
                         || choiceQty !== question.choices.length
                         || lBlankChoiceExists
                });
        setHasChanged(!isEqual(question, aQuestionDetailsProps.question));
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
        console.log("Selected choice: ", selectedChoice);
    };

    const handleSubmit = () =>
    {

        setTriedSubmitting(true);
        if (lError) { return; }

        let lCorrectSum = 0;
        question.choices.forEach((aChoice: TChoice) =>
            aChoice.correct ? lCorrectSum += 1 : lCorrectSum += 0);

        const lEditedQuestion: TQuestion =
        {
            id: question.id,
            name: question.name,
            statement: question.statement,
            correctChoices: lCorrectSum,
            choices: question.choices,
        };

        aQuestionDetailsProps.onSubmit(lEditedQuestion);
    };

    const onChoiceSubmit = (aChoice: TChoice) =>
    {
        const lChoices: TChoice[] = [...question.choices];

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

    const lMemoizedChoiceDetails = useMemo(() =>
    {
        return <ChoiceDetails selectedChoice={selectedChoice} onSaveChoice={onChoiceSubmit}/>
    }, [selectedChoice])

    return (
        <div className={`${flexColClass} mx-auto h-[33em] pt-3 px-[3em] mt-[10em] border-2`}>
            <form>
                <div
                className={`${flexColClass} h-full justify-around`}>
                    <div className={`${formDivClass} my-5 flex-col`}>
                        <div className={`${flexColClass} px-2 justify-between`}>
                                <label className={labelTextClass}> Name </label>
                                <div className={`${flexColClass} justify-center`}>
                                    <input type="text"
                                        className={`${textInputClass} w-[15em] ${error.invalidName ? "border-b-red" : "border-b-green"}`}
                                        value={question.name}
                                        onChange={(event) => setQuestion({ ...question, name: event.target.value })}
                                    />
                                <p className={`text-red text-sm py-1 ${error.invalidName ? "opacity-1" : "opacity-0"}`}>You haven't entered a name</p>
                                </div>
                            </div>
                        <div className={`${flexColClass} justify-between px-2 w-full`}>
                            <label className={`${labelTextClass} w-[15em]`}> Question Statement </label>
                            <div className={`${flexColClass} justify-center`}>
                                <input type="text"
                                    className={`${textInputClass} w-[40em] p-0 mt-2 ${error.invalidStatement ? "border-b-red" : "border-b-green"}`}
                                    value={question.statement}
                                    onChange={(event) => setQuestion({ ...question, statement: event.target.value })}
                                />
                                <p className={`text-red text-sm py-1 ${error.invalidStatement ? "opacity-1" : "opacity-0"}`}>Every question needs a statement!</p>
                            </div>
                        </div>
                    </div>
                    <div className={formDivClass}>
                        <div className={`${flexColClass} border-2 border-black text-center pt-3 w-1/6 h-[197px] bg-white ${choiceQty > 5 ? "overflow-y-scroll" : ""}`}>
                            {
                                Array(choiceQty).fill(0).map((_, index: number) =>
                                {
                                    return <div onClick={() => handleSelectedChoice(index)}><p> Choice #{index} </p></div>
                                })
                            }
                        </div>
                        {lMemoizedChoiceDetails}
                    </div>
                    <div className={`${flexRowClass} items-center h-20 w-[65em] justify-center`}>
                            <button className="border-0 mr-4 rounded-sm text-lg" onClick={aQuestionDetailsProps.onCancelSubmit}> Cancel </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={`${lError ? actioButtonDisabledClass : actionButtonClass} w-[10em]`}>
                                    <p className="font-bold text-white text-lg">Submit</p>
                            </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
