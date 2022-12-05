import { useEffect, useState } from "react";
import { TChoice } from "./ChoiceDetails";
import { formBox, headingText, labelDivClass, labelText, mainContainer, textInputClass } from "../../common/CommonStyling";
import { QuestionDetails, TQuestion } from "./QuestionDetails";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { actioButtonDisabledClass, actionButtonClass, altActionButtonClass } from "../../common/buttons/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import TagsInput from "react-tagsinput";
import { useSelector, useDispatch } from 'react-redux'
import { bankAdded } from "../../reducers/bank";

export type TBank =
{
    bankId: string,
    bankName: string,
    isPublic: boolean,
    tags: string[],
    questions: TQuestion[],
    createdAt: string,
};

const lEmptyBank: TBank =
{
    bankId: "",
    bankName: "",
    isPublic: false,
    tags: [],
    questions: [],
    createdAt: "",
}

const lEmptyChoice: TChoice =
{
    id: 0,
    body: "",
    correct: false,
    explanation: "",
};

type TBankError =
{
    invalidName: boolean,
    invalidQuestion: boolean,
};

export const BankDetails = () =>
{
    const lEmptyQuestion: TQuestion =
    {
        id: uuidv4(),
        statement: "",
        choices: [lEmptyChoice],
    };

    const dispatch = useDispatch()
    const { bankId } = useParams();

    const editingBank = useSelector((state: any) => state.bank.find((aBank: TBank) => aBank.bankId === bankId));

    console.log("Bank Id: ", bankId);
    const [ bank, setBank ] = useState<TBank>(editingBank ?? lEmptyBank);
    const [ addingQuestion, setAddingQuestion ] = useState<boolean>(false);
    const [ selectedQuestion, setSelectedQuestion ] = useState<TQuestion>(lEmptyQuestion);
    const [ questions, setQuestions ] = useState<TQuestion[]>(bank.questions);
    const [ error, setError ] = useState<TBankError>({ invalidName: false, invalidQuestion: false })
    const navigate = useNavigate();

    useEffect(() =>
    {
        setError({
            invalidName: bank.bankName === "",
            invalidQuestion: questions.length === 0,
        });
    }, [questions, bank]);

    const onAddQuestion = () => setAddingQuestion(true);

    console.log("Bank:" , bank);

    const onSelectQuestion = (aQuestionIndex: number) =>
    {
        setSelectedQuestion(questions[aQuestionIndex]);
        setAddingQuestion(true);
    }

    const onCancelSubmit = () =>
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

    }

    const onSubmitQuestion = (aQuestion: TQuestion) =>
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

    return (
        <div className={mainContainer}>
            { addingQuestion
                    ? <QuestionDetails onCancelSubmit={onCancelSubmit} onSubmit={onSubmitQuestion} question={selectedQuestion}/>
                    :  <div className="container flex flex-col w-[60em] mt-[10em]">
                            <div className={formBox}>
                                <h3 className={headingText}> Tell us about your question bank </h3>
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
                                        <div className="container mt-2 items-center flex flex-col justify-between">
                                            <div className="container flex flex-row items-center justify-between">
                                                <h3 className={headingText}> Your questions </h3>
                                                <button className={`${actionButtonClass} mr-2 text-lg font-bold w-[10em]`} onClick={() => setAddingQuestion(true)}>
                                                    Add a question
                                                </button>
                                            </div>
                                            <div className="container flex flex-col h-[20em] overflow-scroll">
                                                {questions.map((aQuestion: TQuestion, index: number) =>
                                                {
                                                    return <a onClick={() => onSelectQuestion(index)}>Question #{index}</a>;
                                                })}
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