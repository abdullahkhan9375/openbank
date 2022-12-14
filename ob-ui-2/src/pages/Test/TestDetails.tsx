import { useEffect, useMemo, useState } from "react";
import {
        formBoxClass,
        headingTextClass,
        labelDivClass,
        labelTextClass,
        mainContainerClass,
        textInputClass
    } from "../../common";
import { TBank, TQuestion, TTest } from "../../model";
import TagsInput from "react-tagsinput";
import { QuestionSubscription } from "./QuestionSubscription";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { SaveItemPanel } from "../../common";
import { testAdded } from "../../reducers/test";
import { TTestError } from "../../model/Test";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { NavPanel } from "../Components/NavPanel";
import { getErrorStyle } from "../../common/utils/GetErrorStyle";

const lEmptyTest: TTest =
{
    id: "",
    name: "",
    isPublic: false,
    createdAt: 0,
    description: "",
    tags: [],
    subscribedQuestions: [],
    timeLimit: 1,
    passingScore: 10,
};

export const TestDetails = () =>
{
    const { id } = useParams();

    const editingTest = useSelector((state: any) => state.test.find((aTest: TTest) => aTest.id === id));

    const [test, setTest] = useState<TTest>(editingTest ?? lEmptyTest);
    const [subscribedQuestions, setSubscribedQuestions] = useState<TQuestion[]>(editingTest?.subscribedQuestions ?? []);
    const [error, setError] = useState<TTestError>(
    {
        invalidName: test.name === "",
        invalidTimeLimit: test.timeLimit > 360 || test.timeLimit <= 0,
        invalidNumQuestions: subscribedQuestions.length === 0,
        invalidPassingScore: test.passingScore === 0,
    });
    const [ hasChanged, setHasChanged ] = useState<boolean>(false);
    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() =>
    {
        setError({
            invalidName: test.name === "",
            invalidTimeLimit: test.timeLimit > 360 || test.timeLimit <= 0,
            invalidNumQuestions: subscribedQuestions.length === 0,
            invalidPassingScore: test.passingScore <= 0,
        });
        setHasChanged(!isEqual(test, editingTest ?? lEmptyTest));
    }, [test, subscribedQuestions])

    const handleSubscribeQuestion = (event: any, aQuestion: TQuestion, aSelectedBank: TBank) =>
    {
        let lSubbedQuestions = [...subscribedQuestions];
        const lQuestionIndex = lSubbedQuestions.findIndex((lQuestion: TQuestion) => lQuestion.id === aQuestion.id);
        if (event.detail === 2)
        {
            setSubscribedQuestions([...new Set([...subscribedQuestions, ...aSelectedBank.questions])]);
            return;
        }
        else
        {
            if (lQuestionIndex === -1)
            {
                setSubscribedQuestions([...subscribedQuestions, aQuestion]);
            }
            else
            {
                lSubbedQuestions = lSubbedQuestions.filter((lQuestion: TQuestion) => lQuestion.id !== aQuestion.id);
                setSubscribedQuestions(lSubbedQuestions);
            }
        }
    };

    const handleSaveTest = () =>
    {
        setTriedSubmitting(true);
        if (lSaveDisabled)
        {
            return;
        }
        const lTest: TTest =
        {
            ...test,
            id: test.id === "" ? uuidv4() : test.id,
            createdAt: test.createdAt === 0 ? moment.now()/1000 : test.createdAt,
            subscribedQuestions,
        };

        dispatch(testAdded(lTest));
        navigate("/tests");
    }

    const handleRemoveQuestion = (id: string) =>
    {
        let lSubbedQuestions = subscribedQuestions.filter((lQuestion: TQuestion) => lQuestion.id !== id);
        setSubscribedQuestions(lSubbedQuestions);
    };

    const MemoizedQuestionSubscription = useMemo(() =>
    {
    return (
        <QuestionSubscription
        subscribedQuestions={subscribedQuestions}
        onSubscribeQuestion={handleSubscribeQuestion}
        onDeleteQuestion={handleRemoveQuestion}
        error={error.invalidNumQuestions}
        />);
    }, [subscribedQuestions]);

    const lSaveDisabled = Object.values(error).includes(true) || !hasChanged;
    return (
        <>
        <NavPanel/>
        <div className={mainContainerClass}>
            <div className="container flex flex-col w-[70em]">
                <div className={formBoxClass}>
                    <h3 className={headingTextClass}> Tell us about your test </h3>
                    <form className="mt-5">
                        <div className="container flex flex-row justify-between">
                            <div className="container mr-3 flex flex-col">
                                <div className={labelDivClass}>
                                    <label
                                        className={labelTextClass}>
                                            Name
                                    </label>
                                    <div className="container flex flex-col justify-center">
                                        <input
                                            value={test.name}
                                            onChange={(event) => { setTest({ ...test, name: event.target.value })}}
                                            className={`${textInputClass} w-[30em] ${getErrorStyle(triedSubmitting, error.invalidName, "BORDER")}`}
                                            type={"text"}
                                        />
                                        <p className={`text-red text-sm py-1 ${getErrorStyle(triedSubmitting, error.invalidName, "OPACITY")}`}>
                                            You haven't entered a name
                                        </p>
                                    </div>
                                </div>
                                <div className={`${labelDivClass} mb-4` }>
                                    <label
                                        className={labelTextClass}>
                                            Description
                                    </label>
                                    <input
                                        value={test.description}
                                        onChange={(event) => { setTest({ ...test, description: event.target.value })}}
                                        className={`${textInputClass} ${test.description !== "" && triedSubmitting ? "border-b-green" : "border-b-black"} w-[35em]`}
                                        type={"text"}
                                    />
                                </div>
                                <div className={labelDivClass}>
                                    <label className={labelTextClass}> Tags </label>
                                    <div className="mt-3">
                                        <TagsInput value={test.tags}
                                                   onChange={(tags: string[]) => setTest({...test, tags: tags })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="container ml-3 border-l-2 border-gray-light pl-4 flex flex-col justify-center">
                                <div className={`${labelDivClass} mb-5` }>
                                    <label className={labelTextClass}> Visibility </label>
                                    <div>
                                        <label className={"text-lg text-black font-normal w-[10em]"}>
                                            Public
                                        </label>
                                        <input
                                            checked={test.isPublic}
                                            onChange={(event) => setTest({ ...test, isPublic: event.target.checked })}
                                            className="bg-gray-light border-0 mx-2" type={"checkbox"}
                                        />
                                    </div>
                                </div>
                                <div className={labelDivClass}>
                                    <label
                                        className={labelTextClass}>
                                            Passing Score (%)
                                    </label>
                                    <div className="container flex flex-col pt-1 justify-center">
                                        <input
                                            value={test.passingScore}
                                            onChange={(event) => { setTest({ ...test, passingScore: Number(event.target.value)})}}
                                            className={`${textInputClass} text-center w-[3em] ${getErrorStyle(triedSubmitting, error.invalidPassingScore, "BORDER")}`}
                                            type={"number"}
                                            max={100} min={1}
                                        />
                                        <p className={`text-red text-sm py-1 ${getErrorStyle(triedSubmitting, error.invalidPassingScore, "OPACITY")}`}>
                                            Passing score can't be less than or equal to 0
                                        </p>
                                    </div>
                                </div>
                                <div className={labelDivClass}>
                                    <label
                                        className={labelTextClass}>
                                            Time Limit (minutes)
                                    </label>
                                    <div className="container flex flex-col pt-1 justify-center">
                                        <input
                                            value={test.timeLimit}
                                            min={1}
                                            onChange={(event) => { setTest({ ...test, timeLimit: Number(event.target.value)})}}
                                            className={`${textInputClass}  text-center  w-[5.5em] ${getErrorStyle(triedSubmitting, error.invalidTimeLimit, "BORDER")} focus:outline-none`} type={"number"}
                                        />
                                        <p className={`text-red text-sm py-1
                                            ${getErrorStyle(triedSubmitting, error.invalidTimeLimit, "OPACITY")}`}>
                                                Time limit has to be between 0 and 360 minutes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {MemoizedQuestionSubscription}
                            <p className={`text-red text-center text-sm py-1 ${getErrorStyle(triedSubmitting, error.invalidNumQuestions, "OPACITY")}`}>
                                Your test needs to be subscribed to questions!
                            </p>
                        </div>
                        <div className="container flex flex-row mx-auto w-full justify-center items-center mt-3">
                            <SaveItemPanel saveText="Save" onSave={handleSaveTest} cancelLink="/tests" error={lSaveDisabled}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
};
