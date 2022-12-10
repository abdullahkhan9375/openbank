import { attempt, isEqual } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { mainContainerClass } from "../../common";
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

    console.log(examAttempt);

    return (
        <div className={mainContainerClass}>
            <h1> {exam.testConfig.name} </h1>
            <div className="container flex flex-row justify-start mt-5 w-[60em]">
                <div className="container flex flex-col justify-start w-[10em] h-[40em] bg-gray-light border-2 border-black">
                    {exam.testConfig.subscribedQuestions.map((aQuestion: TQuestion, lIndex: number) =>
                    {
                        return <div onClick={() => handleSelectQuestion(lIndex)} className={`text-center py-2 text-md cursor-pointer
                        ${lIndex === index ? "bg-orange text-white" : "bg-gray text-black"}`}> Question {lIndex + 1} </div>
                    })}
                </div>
                <div className="container flex p-6 flex-col justify-start w-[50em] h-[40em] bg-gray-light">
                    <h2 className="font-bold text-2xl text-black">{displayedQuestion.statement}</h2>
                    { displayedQuestion.choices.map((aChoice: TChoice, index: number) =>
                    {
                        return (
                            <div
                                onClick={() => handleSelectChoice(aChoice, displayedQuestion)}
                                className={`cursor-pointer ${selectedChoices.find((lChoice: TChoice) => lChoice.id === aChoice.id) !== undefined ? "bg-purple text-white" : "bg-white"}`}>
                                <p className="text-lg py-2 px-2"> {alphabet[index]}. {aChoice.body} </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
