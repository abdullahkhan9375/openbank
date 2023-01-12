import { useEffect, useState } from "react";
import { flexColClass,
        flexRowClass,
        headingTextClass,
        labelDivClass,
        labelTextClass,
        mainContainerClass,
        textInputClass } from "../../common/CommonStyling";
import { TChoice, TQuestion, TQuestionError } from "../../model";
import { isEqual } from "lodash";
import { getErrorStyle } from "../../common/utils/GetErrorStyle";
import { SaveItemPanel } from "../../common";
import { ChoiceTable } from "./ChoiceTable";
import { MessagePanel, TMessage } from "../Components/MessagePanel";

interface IQuestionDetailsProps
{
    question: TQuestion;
    bankId: string;
    numChoices: number;
    onCancelSubmit: () => void;
    onSubmit: (aQuestion: TQuestion) => void;
    onCancel: () => void;
}

export const QuestionDetails = (aQuestionDetailsProps: IQuestionDetailsProps) =>
{
    const lQuestion = aQuestionDetailsProps.question;
    const lIsNew: boolean = lQuestion.name === "";
    const [ question, setQuestion ] = useState<TQuestion>(lQuestion)
    const [ choiceQty, setChoiceQty ] = useState<number>(aQuestionDetailsProps.numChoices);

    const [ message, setMessage ] = useState<TMessage | undefined>(undefined);
    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);
    const [ hasChanged, setHasChanged ] = useState<boolean>(false);
    const [ error, setError ] = useState<TQuestionError>(
        {
            invalidName:        false,
            invalidChoices:     false,
            invalidStatement:   false,
            invalidCorrect:     false,
        }
    );

    const lError: boolean =  error.invalidChoices
                          || error.invalidCorrect
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
        console.log("Choices: ", question.choices);

        const lBlankChoiceExists = question.choices
            .findIndex((aChoice: TChoice) => aChoice.body === "") !== -1;
        const lCorrectOptionDoesntExist = question.choices
            .findIndex((aChoice: TChoice) => aChoice.correct === true) === -1;

        setError({
            invalidName:        question.name === "",
            invalidCorrect:     lCorrectOptionDoesntExist,
            invalidStatement:   question.statement === "",
            invalidChoices:     lBlankChoiceExists
                });
        setHasChanged(!isEqual(question, aQuestionDetailsProps.question));
    }, [question, choiceQty])

    const handleSubmit = () =>
    {
        const lBlankChoiceExists = question.choices
        .findIndex((aChoice: TChoice) => aChoice.body === "") !== -1;

        const lCorrectOptionDoesntExist = question.choices.
            findIndex((aChoice: TChoice) => aChoice.correct === true) === -1;

        if (lBlankChoiceExists && lCorrectOptionDoesntExist)
        {
            setMessage({ severity: "high", message: "choices must have a statement with at least one correct"})
        }

        console.log("Error state: ", error);
        setTriedSubmitting(true);
        if (Object.values(error).includes(true)) return;
        let lCorrectSum = 0;
        question.choices.forEach((aChoice: TChoice) =>
            aChoice.correct ? lCorrectSum += 1 : lCorrectSum += 0);

        const lEditedQuestion: TQuestion =
        {
            id:             question.id,
            bankId:         aQuestionDetailsProps.bankId,
            name:           question.name,
            type:           "question",
            statement:      question.statement,
            correctChoices: lCorrectSum,
            choices:        question.choices,
        };

        aQuestionDetailsProps.onSubmit(lEditedQuestion);
    };

    //TODO: Bank Details does not respond to changes in the Your Questions table.

    const generateChoices = () =>
    {
        const lChoices: TChoice[] = [];
        for (let index = 1; index <= choiceQty + 1; index ++)
        {
            lChoices.push(
                {
                    id:         index,
                    body:       "",
                    correct:    false,
                }
            );
        }

        return lChoices;
    }

    const handleCancel = () =>
    {
        console.log("go back!");
        aQuestionDetailsProps.onCancel()
    }

    return (
        <div className={`${mainContainerClass}`}>
            <h3 className={`${headingTextClass} self-start`}> Edit this question </h3>
            <div className={`${flexRowClass} mr-2 mt-5`}>
                <div className={flexColClass}>
                    <div className={labelDivClass}>
                        <label
                            className={labelTextClass}>
                                Name
                        </label>
                        <div className={`${flexColClass} justify-center`}>
                        <input
                            value={question.name}
                            onChange={(event) => { setQuestion({ ...question, name: event.target.value })}}
                            className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidName, "BORDER")}`} type={"text"}
                        />
                            <p className={`text-red text-sm py-1 ${getErrorStyle(triedSubmitting, error.invalidName, "OPACITY")}`}>
                                You haven't entered a name for your question
                            </p>
                        </div>
                    </div>
                    <div className={labelDivClass}>
                        <label
                            className={labelTextClass}>
                                Statement
                        </label>
                        <input
                            value={question.statement}
                            onChange={(event) => { setQuestion({ ...question, statement: event.target.value })}}
                            className={`${textInputClass} mb-3 w-[60em] ${getErrorStyle(triedSubmitting, question.statement === "", "BORDER")}`} type={"text"}
                        />
                        <p className={`text-red text-sm py-1 ${getErrorStyle(triedSubmitting, error.invalidStatement, "OPACITY")}`}>
                                You haven't written a question statement.
                            </p>
                    </div>
                    <div className={`${flexColClass} justify-between items-center mt-2`}>
                        <div className={`${flexRowClass} items-center justify-between`}>
                            <h3 className={headingTextClass}> Choices </h3>
                        </div>
                        <div className={`${flexColClass} justify-between h-[20em] ${choiceQty > 6 ? "overflow-y-scroll" : ""}`}>
                            {
                               <ChoiceTable
                                choices={lIsNew ? generateChoices() : question.choices}
                                onSaveChoices={(aChoices: TChoice[]) => setQuestion({ ...question, choices: aChoices })}/>
                            }
                        </div>
                    </div>
                <div className={`${flexRowClass} mx-auto w-full justify-center items-center`}>
                    <SaveItemPanel saveText={"Save"} onSave={handleSubmit} onCancel={handleCancel} error={!hasChanged}/>
                </div>
            </div>
        </div>
            <MessagePanel {...message} onAcknowledge={() => setMessage(undefined)}/>
        </div>
    );
};
