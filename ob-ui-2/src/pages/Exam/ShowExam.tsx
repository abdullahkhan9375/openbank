import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { actionButtonClass, mainContainerClass, SaveItemPanel } from "../../common";
import Timer from "../../common/panels/Timer";
import { TQuestionAttempt, TChoice, TExam, TExamAttempt, TQuestion, TResult, TTest } from "../../model";
import { resultAdded, TExamAttemptState } from "../../reducers/result";
import { NavPanel } from "../Components/NavPanel";
import { alphabet, lEmptyExamAttempt, lNewExam, lResult } from "./ExamConstants";

export type TTime =
{
  minutes: number,
  seconds: number,
}

export const ShowExam = () =>
{
    const { id, type } = useParams();
    const lIsReviewMode = type === "reviewMode";

    // TODO: Clean up and refactor.
    const lTest: TTest = useSelector((state: any) => state.test.find((aTest: TTest) => aTest.id === id));
    const lResults: TExamAttemptState = useSelector((state: any) => state.result.find((aExamAttempt: TExamAttemptState) => aExamAttempt.testId === lTest.id));

    let lExamAttempt: TExamAttempt = lEmptyExamAttempt;
    let lMostRecentResult: TResult = lResult;

    if (lIsReviewMode) // Set the exma to the most recent attmept.
    {
        lExamAttempt = lResults.attempts[lResults.attempts.length - 1];
        lMostRecentResult = lExamAttempt.results[lExamAttempt.results.length -1 ]
    }

    const lMostRecentAttempt: TQuestionAttempt = lMostRecentResult.attempt[lMostRecentResult.attempt.length - 1];

    const [ exam, setExam ] = useState<TExam>({...lNewExam, testConfig: lTest });
    const [ displayedQuestion, setDisplayedQuestion ] = useState<TQuestion>(lIsReviewMode ? lMostRecentAttempt.question : exam.testConfig.subscribedQuestions[0]);
    const [ selectedChoices, setSelectedChoices ] = useState<TChoice[]>(lIsReviewMode ? lMostRecentAttempt.selectedChoices
            : []);
    const [ examAttempt, setExamAttempt ] = useState<TExamAttempt>(lExamAttempt);
    const [ questionAttempts, setQuestionAttempts] = useState<TQuestionAttempt[]>(lIsReviewMode ? lMostRecentResult.attempt : []);

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
        const lSelectedAttempt: TQuestionAttempt | undefined = questionAttempts.find((aAttempt: TQuestionAttempt) =>
            aAttempt.question.id === lSelectedQuestion.id);
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

        const lQuestionAttempts: TQuestionAttempt[] = [...questionAttempts];
        const lAttemptedQuestionIndex = lQuestionAttempts.findIndex((aAttempt: TQuestionAttempt) => aAttempt.question.id === aDisplayedQuestion.id);
        if (lAttemptedQuestionIndex === -1)
        {
            lQuestionAttempts.push(
                {
                    question: aDisplayedQuestion,
                    selectedChoices: lSelectedChoices,
                    correct: checkCorrectness(lSelectedChoices, aDisplayedQuestion),
                }
            )
        }
        else
        {
            lQuestionAttempts[lAttemptedQuestionIndex] =
            {
                ...lQuestionAttempts[lAttemptedQuestionIndex],
                selectedChoices: lSelectedChoices,
                correct: checkCorrectness(lSelectedChoices, aDisplayedQuestion),
            }
        }

        setQuestionAttempts(lQuestionAttempts);
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
        const lQuestionAttempt = [...questionAttempts];
        const lExamScore = calculateScore(lQuestionAttempt);
        const lPass = exam.testConfig.passingScore <= lExamScore;
        const lTimeTaken = exam.testConfig.timeLimit * 60 - ((time.minutes * 60) + time.seconds);
        let lStatus = undefined;
        if (lQuestionAttempt.length === exam.testConfig.subscribedQuestions.length)
        {
            lStatus = "COMPLETE";
        }
        else
        {
            lStatus = "INCOMPLETE";
        }

        const lResult: TResult =
        {   status: lStatus,
            score: lExamScore,
            pass: lPass,
            timeTaken: lTimeTaken,
            attempt: lQuestionAttempt,
        };

        const lNewExamAttempt: TExamAttempt =
        {
            ...examAttempt,
            testId: exam.testConfig.id,
            createdAt: Date.now(),
            results: [...examAttempt.results, lResult],
        };

        setExamAttempt(lNewExamAttempt);

        dispatch(resultAdded(lNewExamAttempt));
        navigate("/tests");
    };

    const getQuestionStyle = (aQuestion: TQuestion, activeQuestion: boolean) =>
    {
        if (activeQuestion && !reviewMode)
        {
            return "border-l-[0.5em] border-l-orange text-black";
        }
        const lQuestionAttempt = [...questionAttempts];
        const lQuestionAttemptedIndex: number = lQuestionAttempt.findIndex((aAttempt: TQuestionAttempt) =>
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
            else if (!lQuestionAttempt[lQuestionAttemptedIndex].correct)
            {
                return `${lActiveChoice} border-l-red text-black`;
            }
            else
            {
                return `${lActiveChoice} border-l-green text-black`;
            }
        }
    };

    const getChoiceStyle = (aChoiceId: number, aDisplayedQuestion: TQuestion) =>
    {
        const IsSelectedChoice: boolean = selectedChoices.find((lChoice: TChoice) => lChoice.id === aChoiceId) !== undefined;
        if (reviewMode)
        {
            const lAttemptedQuestion = [...questionAttempts].find((aAttempt: TQuestionAttempt) => aAttempt.question.id === aDisplayedQuestion.id);
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
        <>
        <NavPanel/>
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
                {reviewMode
                    ? <button
                        onClick={() => navigate("/tests")}
                        className={`${actionButtonClass} w-[10em] text-lg text-white font-semibold`}>
                            All good.
                      </button>
                    : <SaveItemPanel
                        saveText="Submit"
                        cancelLink="/tests"
                        onSave={handleSubmitExam}
                        error={lIsReviewMode}
                      />
                }
            </div>
        </div>
        </>
    );
};
