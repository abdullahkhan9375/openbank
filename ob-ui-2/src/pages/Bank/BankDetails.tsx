import { useCallback, useEffect, useMemo, useState } from "react";
import {
    flexColClass,
        flexRowClass,
        formBoxClass,
        headingTextClass,
        labelDivClass,
        labelTextClass,
        mainContainerClass,
        textInputClass
    } from "../../common";
import { QuestionDetails } from "./QuestionDetails";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { actioButtonDisabledClass, actionButtonClass, altActionButtonClass } from "../../common/buttons/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import TagsInput from "react-tagsinput";
import { useSelector, useDispatch } from 'react-redux'
import { bankAdded } from "../../reducers/bank";
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table } from "../../common/Table";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { TBank, TBankError, TChoice, TQuestion } from "../../model";
import { SaveItemPanel } from "../../common";

const lEmptyBank: TBank =
{
    id: "",
    name: "A new bank!",
    isPublic: false,
    tags: [],
    numChoices: 1,
    questions: [],
    createdAt: "",
};

const lEmptyChoice: TChoice =
{
    id: 0,
    body: "",
    correct: false,
    explanation: "",
};

const lEmptyQuestion: TQuestion =
{
    id: uuidv4(),
    name: "",
    statement: "",
    correctChoices: 4,
    choices: [lEmptyChoice],
};

export const BankDetails = () =>
{
    const dispatch = useDispatch();
    const { id } = useParams();

    const editingBank: TBank = useSelector((state: any) => state.bank.find((aBank: TBank) => aBank.id === id));

    const [ bank, setBank ] = useState<TBank>(editingBank ?? lEmptyBank);
    const [ addingQuestion, setAddingQuestion ] = useState<boolean>(false);
    const [ selectedQuestion, setSelectedQuestion ] = useState<TQuestion>(lEmptyQuestion);
    const [ questions, setQuestions ] = useState<TQuestion[]>(bank.questions);
    const [ error, setError ] = useState<TBankError>({ invalidName: bank.name==="", invalidQuestion: bank.questions.length === 0, emptyChoice: false });
    const [ hasChanged, setHasChanged ] = useState<boolean>(false);
    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() =>
    {
        setError({
            ...error,
            invalidName: bank.name === "",
            invalidQuestion: questions.length === 0,
        });
        setHasChanged(!isEqual(bank, editingBank ?? lEmptyBank));
    }, [questions, bank]);

    const validateQuestions = () =>
    {
        for (const question of questions)
        {
            if (question.choices.length !== bank.numChoices)
            {
                setError({ ...error, emptyChoice: true });
                return;
            }
        }
        setError({ ...error, emptyChoice: false })
    };

    useEffect(() =>
    {
        validateQuestions();
    }, [bank.numChoices, bank.questions]);

    const onAddQuestion = () => setAddingQuestion(true);

    const handleDeleteQuestion = (info: CellContext<TQuestion, string>) =>
    {
        let lQuestions = questions;
        lQuestions = lQuestions.filter((aQuestion: TQuestion) => aQuestion.id !== info.row.original.id);
        setQuestions(lQuestions);
    };

    const handleSelectQuestion = (info: CellContext<TQuestion, string>) =>
    {
        const selectedQuestion = questions.find((aQuestion: TQuestion) => aQuestion.id === info.row.original.id);
        if (selectedQuestion !== undefined)
        {
            setSelectedQuestion(selectedQuestion);
            setAddingQuestion(true);
        }
    }

    const handleCancelSubmit = () =>
    {
        setAddingQuestion(false);
    };

    const handleSaveBank = () =>
    {
        if (error.invalidName || error.invalidQuestion) return;

        const lBank: TBank =
        {
            ...bank,
            questions: questions,
            createdAt: String(Date.now()),
            id: bank.id !== "" ? bank.id : uuidv4(),
        };

        dispatch(bankAdded(lBank));
        navigate("/banks");
    }

    const handleCancel = () =>
    {
        navigate("/banks");
    }

    const handleSubmitQuestion = (aQuestion: TQuestion) =>
    {
        const lQuestions: TQuestion[] = [...questions]; 
        const lQuestionIndex: number = questions.findIndex((lQuestion: TQuestion) => lQuestion.id == aQuestion.id);

        if (lQuestionIndex === -1)
        {
            setQuestions([...questions, aQuestion]);
        }
        else if (!isEqual(aQuestion, lQuestions[lQuestionIndex]))
        {
            lQuestions[lQuestionIndex] = aQuestion;
            setQuestions(lQuestions);
        }

        setAddingQuestion(false);
        setSelectedQuestion(lEmptyQuestion);
        validateQuestions();
    };

    const columnHelper = createColumnHelper<TQuestion>();
    const columns = useMemo (() =>[
    columnHelper.accessor('name',
    {
        header: () => "Question Name",
        cell: info => <div className="container px-4 py-1"><p> {info.getValue()} </p></div>
    }),
    columnHelper.accessor("id",{
        header: () => "",
        cell: info => <div className="container flex flex-row justify-around">
            <BsFillPencilFill className="cursor-pointer" onClick={() => handleSelectQuestion(info)}/>
            <BsFillTrashFill className="cursor-pointer" onClick={() => handleDeleteQuestion(info)}/>
            </div>
    }),
    ], [questions]);

    const data = useMemo(() => questions, [questions]);
    const lSaveDisabled = (error.invalidName || error.invalidQuestion || error.emptyChoice) || !hasChanged;
    return (
        <div className={mainContainerClass}>
            { addingQuestion
                    ? <QuestionDetails numChoices={bank.numChoices} onCancelSubmit={handleCancelSubmit} onSubmit={handleSubmitQuestion} question={selectedQuestion}/>
                    :  <div className={flexColClass}>
                            <div className={formBoxClass}>
                                <h3 className={headingTextClass}> {editingBank ? "Edit this question bank" : "Set up a new question bank"}</h3>
                                <form className="py-2">
                                    <div className={`${flexRowClass} mr-2`}>
                                        <div className={flexColClass}>
                                            <div className={labelDivClass}>
                                                <label
                                                    className={labelTextClass}>
                                                        Name
                                                </label>
                                                <div className={`${flexColClass} justify-center`}>
                                                <input
                                                    value={bank.name}
                                                    onChange={(event) => { setBank({ ...bank, name: event.target.value })}}
                                                    className={`${textInputClass} w-[30em] ${error.invalidName ? "border-b-red" : "border-b-green"}`} type={"text"}
                                                />
                                                <p className={`text-red text-sm py-1 ${error.invalidName ? "opacity-1" : "opacity-0"}`}>You haven't entered a name</p>
                                                </div>
                                            </div>
                                            <div className={labelDivClass}>
                                                <label
                                                    className={labelTextClass}>
                                                        Description
                                                </label>
                                                <input
                                                    value={bank.description}
                                                    onChange={(event) => { setBank({ ...bank, description: event.target.value })}}
                                                    className={`${textInputClass} mb-3 w-[30em] ${bank.description !== undefined ? "border-b-green" : "border-b-black"}`} type={"text"}
                                                />
                                            </div>
                                            <div className={labelDivClass}>
                                                <label className={labelTextClass}> Tags </label>
                                                <div className="mt-3">
                                                    <TagsInput value={bank.tags} onChange={(tags: string[]) => setBank({...bank, tags: tags })} />
                                                </div>
                                            </div>
                                            </div>
                                            <div className={`${flexColClass}  border-l-2 border-gray-light pl-4 ml-2`}>
                                                <div className={labelDivClass}>
                                                    <label className={labelTextClass}> Visibility </label>
                                                    <div>
                                                        <label className={`text-lg text-black font-normal w-[20em]`}>
                                                            Public
                                                        </label>
                                                        <input
                                                            checked={bank.isPublic}
                                                            // checked={Boolean(bank.isPublic)}
                                                            onChange={(event) => setBank({ ...bank, isPublic: event.target.checked })}
                                                            className="bg-gray-light border-0 mx-2" type={"checkbox"}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={labelDivClass}>
                                                    <label
                                                        className={labelTextClass}>
                                                            Choices per Question
                                                    </label>
                                                    <input
                                                        value={bank.numChoices}
                                                        type="number"

                                                        min={1}
                                                        onChange={(event) => { setBank({ ...bank, numChoices: Number(event.target.value)})}}
                                                        className={`${textInputClass} text-center w-[5em] ${bank.numChoices >= 1 ? "border-b-green" : "border-b-black"}`}
                                                    />
                                                </div>
                                            </div>
                                    </div>
                                    <div className={`${flexColClass} justify-between items-center mt-2`}>
                                        <div className={`${flexRowClass} items-center justify-between`}>
                                            <h3 className={headingTextClass}> Your questions </h3>
                                            <button className={`${actionButtonClass} mr-2 text-lg font-bold w-[10em]`} onClick={() => setAddingQuestion(true)}>
                                                Add a question
                                            </button>
                                        </div>
                                        <div className={`${flexColClass} justify-between h-[20em]`}>
                                            {
                                                questions.length > 0
                                                ? <Table data={data} columns={columns}/>
                                                : <div className="mt-10 text-center">
                                                    <h2 className="font-normal text-4xl text-gray">You haven't added any questions yet.</h2>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className={`${flexRowClass} mx-auto w-full justify-center items-center`}>
                                        <SaveItemPanel saveText={"Save"} onSave={handleSaveBank} cancelLink={"/banks"} error={lSaveDisabled}/>
                                    </div>
                                </form>
                            </div>
                        </div>
            }

    <style>
    </style>
        </div>
    )
}