import { attempt, isEqual, result } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { mainContainerClass, SaveItemPanel } from "../../common";
import Timer from "../../common/panels/Timer";
import { TQuestionAttempt, TChoice, TExam, TExamAttempt, TQuestion, TResult, TTest } from "../../model";
import { resultAdded, TExamAttemptState } from "../../reducers/result";

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

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
};

const lResult: TResult =
{
    status: "INCOMPLETE",
    score: 0,
    pass: false,
    timeTaken: -1,
};

const lEmptyExamAttempt: TExamAttempt =
{
    id: uuidv4(),
    testId: lNewExam.testConfig.id,
    examId: lNewExam.id,
    createdAt: 0,
    attempt: [],
    result: lResult,
};

export type TTime =
{
  minutes: number,
  seconds: number,
}

export const ShowExam = () =>
{
    const { id, type } = useParams();
    console.log("Type: ", type);
    const lIsReviewMode = type === "reviewMode";

    const lTest: TTest = useSelector((state: any) => state.test.find((aTest: TTest) => aTest.id === id));
    const lResults: TExamAttemptState = useSelector((state: any) => state.result.find((aExamAttempt: TExamAttemptState) => aExamAttempt.testId === lTest.id));
    const lExamAttempt: TExamAttempt = lIsReviewMode ? lResults.attempts[lResults.attempts.length - 1] : lEmptyExamAttempt;
    const lMostRecentAttempt: TQuestionAttempt = lExamAttempt.attempt[lExamAttempt.attempt.length - 1];

    const [ exam, setExam ] = useState<TExam>({...lNewExam, testConfig: lTest });
    const [ displayedQuestion, setDisplayedQuestion ] = useState<TQuestion>(lIsReviewMode ? lMostRecentAttempt.question : exam.testConfig.subscribedQuestions[0]);
    const [ selectedChoices, setSelectedChoices ] = useState<TChoice[]>(lIsReviewMode ? lMostRecentAttempt.selectedChoices
            : []);
    const [ examAttempt, setExamAttempt ] = useState<TExamAttempt>(lExamAttempt);
    const [ index, setIndex ] = useState<number>(0);
    const [ reviewMode, setReviewMode ] = useState<boolean>(lIsReviewMode);
    const [ time, setTime ] = useState<TTime>({ minutes: exam.testConfig.timeLimit, seconds: 0 });

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        const lSelectedAttempt: TQuestionAttempt | undefined = examAttempt.attempt.find((aAttempt: TQuestionAttempt) => aAttempt.question.id === lSelectedQuestion.id);
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
        const lAttemptedQuestionIndex = lExamAttempt.findIndex((aAttempt: TQuestionAttempt) => aAttempt.question.id === aDisplayedQuestion.id);
        if (lAttemptedQuestionIndex === -1)
        {
            lExamAttempt.push(
                {
                    question: aDisplayedQuestion,
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

    const calculateScore = (aAttempt: TQuestionAttempt[]) =>
    {
        let lScore = 0;
        aAttempt.forEach((aAttempt: TQuestionAttempt) => lScore += aAttempt.correct ? 1 : 0);
        const lTotalScore = exam.testConfig.subscribedQuestions.length;
        return (lScore / lTotalScore) * 100;
    }

    const handleSubmitExam = () =>
    {
        setReviewMode(true);
        const lExamAttempt = [...examAttempt.attempt];
        const lExamScore = calculateScore(lExamAttempt);
        const lPass = exam.testConfig.passingScore <= lExamScore;
        const lTimeTaken = exam.testConfig.timeLimit * 60 - ((time.minutes * 60) + time.seconds);
        let lStatus = undefined;
        if (lExamAttempt.length === exam.testConfig.subscribedQuestions.length)
        {
            lStatus = "COMPLETE";
        }
        else
        {
            lStatus = "INCOMPLETE";
        }

        const lNewExamAttempt: TExamAttempt =
        {
            ...examAttempt,
            testId: exam.testConfig.id,
            createdAt: Date.now(),
            result:
            {
                status: lStatus,
                score: lExamScore,
                pass: lPass,
                timeTaken: lTimeTaken,
            }
        };

        setExamAttempt(lNewExamAttempt);

        dispatch(resultAdded(lNewExamAttempt));
        navigate("/tests");
    };

    // console.log(examAttempt);

    const getQuestionStyle = (aQuestion: TQuestion, activeQuestion: boolean) =>
    {
        if (activeQuestion && !reviewMode)
        {
            return "border-l-[0.5em] border-l-orange text-black";
        }
        const lExamAttempt = [...examAttempt.attempt];
        const lQuestionAttemptedIndex: number = lExamAttempt.findIndex((aAttempt: TQuestionAttempt) =>
            aAttempt.question.id === aQuestion.id && (aAttempt.selectedChoices.length !== 0));
        const lActiveChoice = activeQuestion ? "border-l-[0.5em]" : "border-l-[0.7em]";
        if (!reviewMode)
        {
            return lQuestionAttemptedIndex === -1
                ? "border-l-[0.7em] border-l-black text-black"
                : "border-l-[0.7em] border-l-purple text-black";
        }
        else
        {
            if (lQuestionAttemptedIndex === -1)
            {
                return `${lActiveChoice} border-l-red text-black`;
            }
            else if (!lExamAttempt[lQuestionAttemptedIndex].correct)
            {
                return `${lActiveChoice} border-l-red text-black`;
            }
            else
            {
                return `${lActiveChoice} border-l-green text-black`;
            }
        }
    }

    const getChoiceStyle = (aChoiceId: number, aDisplayedQuestion: TQuestion) =>
    {
        const IsSelectedChoice: boolean = selectedChoices.find((lChoice: TChoice) => lChoice.id === aChoiceId) !== undefined;
        if (reviewMode)
        {
            const lAttemptedQuestion = [...examAttempt.attempt].find((aAttempt: TQuestionAttempt) => aAttempt.question.id === aDisplayedQuestion.id);
            let lStyleString = `${aDisplayedQuestion.choices.find((aChoice: TChoice) => aChoice.id === aChoiceId)?.correct
                ? "font-bold text-green"
                : "font-bold text-red"}`;
        
            if (lAttemptedQuestion === undefined)
            {
                return lStyleString;
            }
            else
            {
                if (lAttemptedQuestion.correct)
                {
                    return `${lStyleString} ${IsSelectedChoice ? "border-2 border-purple border-l-[0.7em]" : "text-black"}`;
                }
                else
                {
                    return `${lStyleString} ${IsSelectedChoice ? "border-2 border-purple border-l-[0.7em]" : "text-black"}`;
                }
            }
        }
       return selectedChoices.find((lChoice: TChoice) => lChoice.id === aChoiceId) !== undefined
            ? "border-2 border-l-[0.7em] border-purple text-black"
            : "border-2 border-l-[0.7em] text-black border-white";
    };

    return (
        <div className={mainContainerClass}>
            <h1> {exam.testConfig.name} </h1>
            <div className="self-end">
            { time.minutes >= 0 && time.seconds >= 0 && !lIsReviewMode
                ? <Timer
                    time={time}
                    onTimeChange={setTime}
                    pauseTime={reviewMode}
                    />
                : <></>
            }
            </div>
            <div className="container flex flex-row justify-start mt-5">
                <div className="container flex flex-col justify-start w-1/6 h-[40em] border-r-2 border-black">
                    {exam.testConfig.subscribedQuestions.map((aQuestion: TQuestion, lIndex: number) =>
                    {
                        return <div onClick={() => handleSelectQuestion(lIndex)}
                        className={`text-center font-bold py-2 text-md cursor-pointer ${getQuestionStyle(aQuestion, lIndex === index)}`}> Question {lIndex + 1} </div>
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
                                onClick={() => reviewMode ? {} : handleSelectChoice(aChoice, displayedQuestion)}
                                className={`cursor-pointer mt-3 rounded-sm ${getChoiceStyle(aChoice.id, displayedQuestion)}`}>
                                <p className="text-lg py-2 px-3"> {alphabet[index]}. {aChoice.body} </p>
                                {reviewMode ? <p className="text-md py-2 pl-7 text-gray">{aChoice.explanation} </p> : <></>}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-2">
                <SaveItemPanel saveText="Submit" cancelLink="/tests" onSave={handleSubmitExam} error={lIsReviewMode}/>
            </div>
        </div>
    );
};
