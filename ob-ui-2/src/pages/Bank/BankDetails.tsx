import { useEffect, useMemo, useState } from "react";
import { formBox, headingText, labelDivClass, labelText, mainContainer, textInputClass } from "../../common/CommonStyling";
import { QuestionDetails } from "./QuestionDetails";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { actioButtonDisabledClass, actionButtonClass, altActionButtonClass } from "../../common/buttons/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import TagsInput from "react-tagsinput";
import { useSelector, useDispatch } from 'react-redux'
import { bankAdded } from "../../reducers/bank";
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DeleteDialog } from "../../common/dialogs/DeleteDialog";
import { Table } from "../../common/Table";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { TBank, TBankError, TChoice, TQuestion } from "../../model";

const lEmptyBank: TBank =
{
    bankId: "",
    bankName: "",
    isPublic: false,
    tags: [],
    numChoices: 0,
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

export const BankDetails = () =>
{
    const lEmptyQuestion: TQuestion =
    {
        id: uuidv4(),
        name: "",
        statement: "",
        choices: [lEmptyChoice],
    };

    const dispatch = useDispatch();
    const { bankId } = useParams();

    const editingBank = useSelector((state: any) => state.bank.find((aBank: TBank) => aBank.bankId === bankId));

    const [ bank, setBank ] = useState<TBank>(editingBank ?? lEmptyBank);
    const [ addingQuestion, setAddingQuestion ] = useState<boolean>(false);
    const [ selectedQuestion, setSelectedQuestion ] = useState<TQuestion>(lEmptyQuestion);
    const [ questions, setQuestions ] = useState<TQuestion[]>(bank.questions);
    const [ error, setError ] = useState<TBankError>({ invalidName: false, invalidQuestion: false })
    const navigate = useNavigate();
    const [questionForDeletion, setQuestionForDeletion] = useState<CellContext<TQuestion, string> | undefined>(undefined);

    useEffect(() =>
    {
        setError({
            invalidName: bank.bankName === "",
            invalidQuestion: questions.length === 0,
        });
    }, [questions, bank]);

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
        else console.log("Could not find question.");
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
            bankId: bank.bankId !== "" ? bank.bankId : uuidv4(),
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
        const lQuestions: TQuestion[] = questions; 
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

    return (
        <div className={mainContainer}>
            { addingQuestion
                    ? <QuestionDetails numChoices={bank.numChoices} onCancelSubmit={handleCancelSubmit} onSubmit={handleSubmitQuestion} question={selectedQuestion}/>
                    :  <div className="container flex flex-col w-[60em]">
                            <div className={formBox}>
                                <h3 className={headingText}> {editingBank ? "Edit this question bank." : "Set up a new Question Bank"}</h3>
                                <form className="py-2">
                                    <div className="container flex flex-col">
                                        <div className={labelDivClass}>
                                            <label
                                                className={labelText}>
                                                    Name
                                            </label>
                                            <input
                                                value={bank.bankName}
                                                onChange={(event) => { setBank({ ...bank, bankName: event.target.value })}}
                                                className={`${textInputClass} w-[30em]`} type={"text"}
                                            />
                                        </div>
                                        <div className={labelDivClass}>
                                            <label className={labelText}> Visibility </label>
                                            <div>
                                                <label className={labelText}>
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
                                                <label className={labelText}> Tags </label>
                                                <TagsInput value={bank.tags} onChange={(tags: string[]) => setBank({...bank, tags: tags })} />
                                            </div>
                                        </div>
                                        <div className={labelDivClass}>
                                            <label
                                                className={labelText}>
                                                    Choices per Question
                                            </label>
                                            <input
                                                value={bank.numChoices}
                                                type="number"
                                                onChange={(event) => { setBank({ ...bank, numChoices: Number(event.target.value)})}}
                                                className={`${textInputClass} w-[5em]`}
                                            />
                                        </div>
                                        <div className="container mt-2 items-center flex flex-col justify-between">
                                            <div className="container flex flex-row items-center justify-between">
                                                <h3 className={headingText}> Your questions </h3>
                                                <button className={`${actionButtonClass} mr-2 text-lg font-bold w-[10em]`} onClick={() => setAddingQuestion(true)}>
                                                    Add a question
                                                </button>
                                            </div>
                                            <div className="container flex flex-col h-[20em]">
                                                {
                                                    questions.length > 0
                                                    ? <Table data={data} columns={columns}/>
                                                    : <div className="mt-10 text-center">
                                                        <h2 className="font-normal text-4xl text-gray">You haven't added any questions yet.</h2>
                                                      </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="container flex flex-row mx-auto w-full justify-center items-center">
                                            <button type="button" className={`bg-white hover:border-white text-black text-lg w-[10em] mx-3`}>
                                                <Link to="/banks" className="text-black hover:text-black">Cancel</Link>
                                            </button>
                                            <button type="button" onClick={handleSaveBank} className={`${(error.invalidName || error.invalidQuestion)
                                                    ? `${actioButtonDisabledClass} text-lg w-[10em] mx-3` :
                                                    `${altActionButtonClass} text-gray-light text-lg w-[10em] mx-3 hover:border-white`}`}>
                                                        Save
                                            </button>
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