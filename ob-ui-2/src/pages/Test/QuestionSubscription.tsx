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

interface IQuestionSubscriptionProps
{
    subscribedQuestions: TQuestion[],
    onSubscribeQuestion: (event: any, aQuestion: TQuestion) => void;
    onDeleteQuestion: (id: string) => void;
}

export const QuestionSubscription = (aSubProps: IQuestionSubscriptionProps) =>
{
    const lSubscribedBanks = useSelector((state: any) => state.bank);
    console.log("Subscribed banks: ", lSubscribedBanks);

    const [selectedBank, setSelectedBank] = useState<TBank | undefined>(undefined);
   
    const checkQuestionExists = (id: string) =>
    {
        const lFindQuestion = aSubProps.subscribedQuestions.findIndex((aQuestion: any) => aQuestion.id === id);
        return lFindQuestion !== -1
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
                                <a onClick={() => {}}> {aQuestion.name} </a>
                                <input
                                    type="checkbox"
                                    className="bg-gray-light"
                                    checked={aSubProps.subscribedQuestions.findIndex((lQuestion: TQuestion) => lQuestion.id === aQuestion.id) !== -1}
                                    onChange={(event) => aSubProps.onSubscribeQuestion(event, aQuestion)}/>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="container flex flex-col items-center">
                <h3 className={labelText}> Subscribed Questions </h3>
                <div className={lSubscriptionBoxClass}>
                    { aSubProps.subscribedQuestions.map((aQuestion: TQuestion) =>
                    {
                        return (
                            <div>
                                <a>{aQuestion.name}</a>
                                <span onClick={() => aSubProps.onDeleteQuestion(aQuestion.id)}> X </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
};
