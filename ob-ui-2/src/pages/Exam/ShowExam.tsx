import { attempt, isEqual } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { mainContainerClass, SaveItemPanel } from "../../common";
import Timer from "../../common/panels/Timer";
import { TChoice, TQuestion, TTest } from "../../model";

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

export type TResult =
{
    status: "COMPLETE" | "INCOMPLETE",
    score: number,
    pass: boolean,
    timeTaken: number,
};

export type TExam =
{
    id: string,
    testConfig: TTest,
    result: TResult,
};

const lEmptyQuestion: TQuestion =
{
    id: "",
    name: "",
    statement: "",
    correctChoices: 0,
    choices: [ { id: 0, correct: false, body: ""}]
};

const lNewExam: TExam =
{
    id: uuidv4(),
    testConfig:
    {
        id: "",
        name: "",
        isPublic: false,
        createdAt: "",
        description: "",
        tags: [],
        timeLimit: 0,
        passingScore: 0,
        subscribedQuestions: [lEmptyQuestion],
    },
    result:
    {
        status: "INCOMPLETE",
        score: 0,
        pass: false,
        timeTaken: 0,
    }
};

type TAttempt =
{
    questionId: string,
    selectedChoices: TChoice[],
    correct: boolean,
};

type TExamAttempt =
{
    id: string,
    attempt: TAttempt[],
};

const lExamAttempt: TExamAttempt =
{
    id: uuidv4(),
    attempt: [],
};

export const ShowExam = () =>
{
    const { id } = useParams();

    const lTest: TTest = useSelector((state: any) => state.test.find((aTest: TTest) => aTest.id === id));

    const [ exam, setExam ] = useState<TExam>({...lNewExam, testConfig: lTest });
    const [ displayedQuestion, setDisplayedQuestion ] = useState<TQuestion>(exam.testConfig.subscribedQuestions[0]);
    const [ selectedChoices, setSelectedChoices ] = useState<TChoice[]>([]);
    const [ examAttempt,setExamAttempt ] = useState<TExamAttempt>(lExamAttempt);
    const [ index, setIndex ] = useState<number>(0);

    const checkCorrectness = (aChoices: TChoice[], aDisplayedQuestion: TQuestion) =>
    {
        for (const lChoice of aChoices)
        {
            if (aDisplayedQuestion.choices.find((aChoice: TChoice) => aChoice.id === lChoice.id)?.correct === false)
            {
                return false;
            }
        }
        return true;
    }

    const handleSelectQuestion = (aIndex: number) =>
    {
        const lSelectedQuestion = exam.testConfig.subscribedQuestions[aIndex];
        setIndex(aIndex);
        setDisplayedQuestion(lSelectedQuestion);
        const lSelectedAttempt: TAttempt | undefined = examAttempt.attempt.find((aAttempt: TAttempt) => aAttempt.questionId === lSelectedQuestion.id);
        if (lSelectedAttempt === undefined)
        {
            setSelectedChoices([]);
        }
        else
        {
            setSelectedChoices(lSelectedAttempt.selectedChoices);
        }
    };

    const handleSelectChoice = (aChoice: TChoice, aDisplayedQuestion: TQuestion) =>
    {
        let lSelectedChoices: TChoice[] = [...selectedChoices];
        const lSelectedChoiceIndex: number = lSelectedChoices.findIndex((lChoice: TChoice) => lChoice.id === aChoice.id);
        if (lSelectedChoiceIndex !== -1)
        {
            lSelectedChoices = lSelectedChoices.filter((lChoice: TChoice) => lChoice.id !== aChoice.id);
        }
        else if (aDisplayedQuestion.correctChoices > 1)
        {
            if (lSelectedChoices.length >= aDisplayedQuestion.correctChoices)
            {
                return;
            }
            else
            {
                lSelectedChoices.push(aChoice);
            }
        }
        else
        {
            lSelectedChoices = [aChoice];
        }

        const lExamAttempt = [...examAttempt.attempt];
        const lAttemptedQuestionIndex = lExamAttempt.findIndex((aAttempt: TAttempt) => aAttempt.questionId === aDisplayedQuestion.id);
        if (lAttemptedQuestionIndex === -1)
        {
            lExamAttempt.push(
                {
                    questionId: aDisplayedQuestion.id,
                    selectedChoices: lSelectedChoices,
                    correct: checkCorrectness(lSelectedChoices, aDisplayedQuestion),
                }
            )
        }
        else
        {
            lExamAttempt[lAttemptedQuestionIndex] =
            {
                ...lExamAttempt[lAttemptedQuestionIndex],
                selectedChoices: lSelectedChoices,
                correct: checkCorrectness(lSelectedChoices, aDisplayedQuestion),
            }
        }
        setExamAttempt(
            {
                ...examAttempt,
                attempt: lExamAttempt,
            }
        );
        setSelectedChoices(lSelectedChoices);
    };

    const handleSaveTest = () =>
    {
        console.log(examAttempt);
    }

    const getQuestionStyle = (aQuestion: TQuestion, activeQuestion: boolean) =>
    {
        if (activeQuestion)
        {
            return "border-l-[0.5em] border-l-orange text-black";
        }
        const lQuestionAttempted: number = [...examAttempt.attempt].findIndex((aAttempt: TAttempt) =>
            aAttempt.questionId === aQuestion.id && (aAttempt.selectedChoices.length !== 0));
        const lReviewMode = false; // add this later.
        if (lQuestionAttempted === -1)
        {
            return "border-l-[0.7em] border-l-black text-black";
        }
        else if (!lReviewMode && lQuestionAttempted !== -1)
        {   
            return "border-l-[0.7em] border-l-purple text-black";
        }
    }

    return (
        <div className={mainContainerClass}>
            <h1> {exam.testConfig.name} </h1>
            <div className="self-end">
                <Timer timeInMinutes={exam.testConfig.timeLimit} onTimeUp={(aMinutes: number) => console.log(aMinutes)}/>
            </div>
            <div className="container flex flex-row justify-start mt-5">
                <div className="container flex flex-col justify-start w-1/6 h-[40em] border-r-2 border-black">
                    {exam.testConfig.subscribedQuestions.map((aQuestion: TQuestion, lIndex: number) =>
                    {
                        return <div onClick={() => handleSelectQuestion(lIndex)}
                        className={`text-center font-bold py-2 text-md rounded-sm cursor-pointer ${getQuestionStyle(aQuestion, lIndex === index)}`}> Question {lIndex + 1} </div>
                    })}
                </div>
                <div className="container flex p-6 flex-col justify-start w-5/6 h-[40em]">
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="font-bold text-2xl text-black">{displayedQuestion.statement}</h2>
                        <p> Choose ({selectedChoices.length}/{displayedQuestion.correctChoices})</p>
                    </div>
                    { displayedQuestion.choices.map((aChoice: TChoice, index: number) =>
                    {
                        return (
                            <div
                                onClick={() => handleSelectChoice(aChoice, displayedQuestion)}
                                className={`cursor-pointer mt-3 rounded-sm ${selectedChoices.find((lChoice: TChoice) => lChoice.id === aChoice.id) !== undefined ? "border-2 border-l-[0.7em] border-purple text-black" : ""}`}>
                                <p className="text-lg py-2 px-3"> {alphabet[index]}. {aChoice.body} </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-2">
                <SaveItemPanel saveText="Submit" cancelLink="/tests" onSave={() => {}} error={false}/>
            </div>
        </div>
    );
};
