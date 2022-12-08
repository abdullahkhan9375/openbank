import { ChangeEventHandler, useState } from "react";
import { labelText } from "../../common/CommonStyling"
import { TBank, TChoice, TQuestion } from "../../model";
import { useSelector } from "react-redux";

const lSubscriptionWidth = 56;
const lSubscriptionBoxClass = `container flex flex-col text-center w-[${lSubscriptionWidth/3}em] h-[20em] bg-white border-2`;

const lEmptyChoice: TChoice =
{
    id: 0,
    body: "",
    correct: false,
    explanation: "",
};

export const QuestionSubscription = () =>
{
    const lSubscribedBanks = useSelector((state: any) => state.bank);
    console.log("Subscribed banks: ", lSubscribedBanks);

    const [selectedBank, setSelectedBank] = useState<TBank | undefined>(undefined);
    console.log("Selected bank: ", selectedBank);
    const [subscribedQuestions, setSubscribedQuestions] = useState<TQuestion[]>([]);
    console.log("Subscribed questiosn: ", subscribedQuestions);
    
    const checkQuestionExists = (id: string) =>
    {
        const lFindQuestion = subscribedQuestions.findIndex((aQuestion: any) => aQuestion.id === id);
        return lFindQuestion !== -1
    };

    const handleSubscribeQuestion = (event: any, aQuestion: TQuestion) =>
    {
        let lSubbedQuestions = subscribedQuestions;
        console.log("Checked: ", event.target.checked);
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

    const handleRemoveQuestion = (id: string) =>
    {
        let lSubbedQuestions = subscribedQuestions.filter((lQuestion: TQuestion) => lQuestion.id !== id);
        setSubscribedQuestions(lSubbedQuestions);
    };

    return (
        <div className={`container flex flex-row mx-auto w-[${lSubscriptionWidth}em] justify-around`}>
            <div className="container flex flex-col items-center">
                <h3 className={labelText}> Subscribed Banks </h3>
                <div className={lSubscriptionBoxClass}>
                    {lSubscribedBanks.map((aBank: TBank) =>
                    {
                        return (
                        <div onClick={() => setSelectedBank(aBank)} className={`container flex flex-row items-center justify-center overflow-scroll ${selectedBank?.bankId === aBank.bankId ? "bg-orange" : "bg-gray-light"}`}>
                            <a><p className="text-lg"> {aBank.bankName} </p></a>
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="container flex flex-col items-center">
                <h3 className={labelText}> Questions </h3>
                <div className={lSubscriptionBoxClass}>
                    {selectedBank?.questions.map((aQuestion: TQuestion) =>
                    {
                        return (<div>
                                <a onClick={() => {}}> {aQuestion.id} </a>
                                <input
                                    type="checkbox"
                                    className="bg-gray-light"
                                    checked={subscribedQuestions.findIndex((lQuestion: TQuestion) => lQuestion.id === aQuestion.id) !== -1}
                                    onChange={(event) => handleSubscribeQuestion(event, aQuestion)}/>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="container flex flex-col items-center">
                <h3 className={labelText}> Subscribed Questions </h3>
                <div className={lSubscriptionBoxClass}>
                    { subscribedQuestions.map((aQuestion: TQuestion) =>
                    {
                        return (
                            <div>
                                <a>{aQuestion.id}</a>
                                <span onClick={() => handleRemoveQuestion(aQuestion.id)}> X </span>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}