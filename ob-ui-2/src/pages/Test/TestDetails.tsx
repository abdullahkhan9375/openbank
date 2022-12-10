import { useEffect, useMemo, useState } from "react";
import {
        formBoxClass,
        headingTextClass,
        labelDivClass,
        labelTextClass,
        mainContainerClass,
        textInputClass
    } from "../../common";
import { TQuestion, TTest } from "../../model";
import TagsInput from "react-tagsinput";
import { QuestionSubscription } from "./QuestionSubscription";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { SaveItemPanel } from "../../common";
import { testAdded } from "../../reducers/test";
import { TTestError } from "../../model/Test";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from "uuid";

const lEmptyTest: TTest =
{
    id: uuidv4(),
    name: "",
    isPublic: false,
    createdAt: "",
    description: "",
    tags: [],
    subscribedQuestions: [],
    timeLimit: 0,
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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() =>
    {
        console.log(subscribedQuestions);
        setError({
        invalidName: test.name === "",
        invalidTimeLimit: test.timeLimit > 360 || test.timeLimit <= 0,
        invalidNumQuestions: subscribedQuestions.length === 0,
        invalidPassingScore: test.passingScore === 0,
        });
        setHasChanged(!isEqual(test, editingTest ?? lEmptyTest));
        console.log(error);
    }, [test, subscribedQuestions])

    const handleSubscribeQuestion = (event: any, aQuestion: TQuestion) =>
    {
        let lSubbedQuestions = [...subscribedQuestions];
        if (event.target.checked)
        {
            const lQuestionIndex = lSubbedQuestions.findIndex((lQuestion: TQuestion) => lQuestion.id === aQuestion.id);
            if (lQuestionIndex === -1)
            {
                setSubscribedQuestions([...subscribedQuestions, aQuestion]);
            }
        }
        else
        {
            lSubbedQuestions = lSubbedQuestions.filter((lQuestion: TQuestion) => lQuestion.id !== aQuestion.id);
            setSubscribedQuestions(lSubbedQuestions);
        }
    };

    const handleSaveTest = () =>
    {
        console.log("Saved Test: ", test);

        const lTest: TTest =
        {
            ...test,
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
        <div className={mainContainerClass}>
            <div className="container flex flex-col w-[60em]">
            <div className={formBoxClass}>
                <h3 className={headingTextClass}> Tell us about your test </h3>
                <form className="py-2">
                    <div className="container flex flex-col">
                        <div className={labelDivClass}>
                            <label
                                className={labelTextClass}>
                                    Name
                            </label>
                            <input
                                value={test.name}
                                onChange={(event) => { setTest({ ...test, name: event.target.value })}}
                                className={`${textInputClass} w-[30em] ${error.invalidName ? "border-red" : "border-black"}`} type={"text"}
                            />
                        </div>
                        <div className={labelDivClass}>
                            <label
                                className={labelTextClass}>
                                    Description
                            </label>
                            <input
                                value={test.description}
                                onChange={(event) => { setTest({ ...test, description: event.target.value })}}
                                className={`${textInputClass} w-[40em] h-[4em]`} type={"text"}
                            />
                        </div>
                        <div className={labelDivClass}>
                            <label className={labelTextClass}> Visibility </label>
                            <div>
                                <label className={labelTextClass}>
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
                                    Passing Score
                            </label>
                            <input
                                value={test.passingScore}
                                onChange={(event) => { setTest({ ...test, passingScore: Number(event.target.value)})}}
                                className={`${textInputClass} w-[5.5em] ${error.invalidPassingScore? "border-red" : "border-black"}`} type={"number"}
                            />
                        </div>
                        <div className={labelDivClass}>
                            <label
                                className={labelTextClass}>
                                    Time Limit
                            </label>
                            <input
                                value={test.timeLimit}
                                onChange={(event) => { setTest({ ...test, timeLimit: Number(event.target.value)})}}
                                className={`${textInputClass} w-[5.5em] focus:outline-none ${error.invalidTimeLimit ? "border-red" : "border-black"}`} type={"number"}
                            />
                        </div>
                            <div className={labelDivClass}>
                                <label className={labelTextClass}> Tags </label>
                                <TagsInput value={test.tags} onChange={(tags: string[]) => setTest({...test, tags: tags })} />
                            </div>
                        </div>
                        {MemoizedQuestionSubscription}
                        <div className="container flex flex-row mx-auto w-full justify-center items-center mt-3">
                            <SaveItemPanel onSave={handleSaveTest} cancelLink="/tests" error={lSaveDisabled}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};
