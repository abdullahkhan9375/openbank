import { ChangeEventHandler, useState } from "react";
import { labelTextClass } from "../../common/CommonStyling"
import { TBank, TChoice, TQuestion } from "../../model";
import { useSelector } from "react-redux";
import { BsXSquareFill } from "react-icons/bs";

const lSubscriptionWidth = 56;
const lSubscriptionBoxClass = `container flex flex-col text-center w-[${lSubscriptionWidth/3}em]
        h-[20em] bg-white border-2`;

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
    onSubscribeQuestion: (event: any, aQuestion: TQuestion, aSelectedBank: TBank) => void;
    onDeleteQuestion: (id: string) => void;
    error: boolean;
}

export const QuestionSubscription = (aSubProps: IQuestionSubscriptionProps) =>
{
    const lSubscribedBanks: TBank[] = useSelector((state: any) => state.bank);
    // console.log("Subscribed banks: ", lSubscribedBanks);

    const [selectedBank, setSelectedBank] = useState<TBank | undefined>(undefined);
   
    const checkQuestionExists = (id: string) =>
    {
        return aSubProps.subscribedQuestions.findIndex((lQuestion: TQuestion) => lQuestion.id === id) !== -1
    };

    return (
        <div className={`container flex flex-row mt-10 mx-auto w-[${lSubscriptionWidth}em] justify-around`}>
            <div className="container flex flex-col items-center">
                <h3 className={`${labelTextClass} text-center`}> Subscribed Banks </h3>
                <div className={`${lSubscriptionBoxClass} overflow-scroll`}>
                    {lSubscribedBanks.map((aBank: TBank) =>
                    {
                        return (
                        <div onClick={() => setSelectedBank(aBank)} className={`container flex flex-row items-center justify-center cursor-pointer overflow-scroll ${selectedBank?.id === aBank.id ? "bg-purple" : "bg-gray-light"}`}>
                            <a><p className={`text-md py-1 ${selectedBank?.id === aBank.id ? "text-white" : "text-black"}`}> {aBank.name} </p></a>
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="container flex flex-col items-center">
                <h3 className={`${labelTextClass} text-center`}> Questions </h3>
                <div className={`${lSubscriptionBoxClass} overflow-scroll`}>
                    {selectedBank?.questions.map((aQuestion: TQuestion) =>
                    {
                        const lIsSubscribed = checkQuestionExists(aQuestion.id);
                        return (
                            <div
                                onClick={(event) => aSubProps.onSubscribeQuestion(event, aQuestion, selectedBank)}
                                className={`container flex flex-row mx-auto justify-center
                                    ${lIsSubscribed ? "bg-purple text-white": "bg-gray-light"}`}>
                                <p className={"text-lg py-1"} onClick={() => {}}> {aQuestion.name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={`container flex flex-col items-center`}>
                <h3 className={`${labelTextClass} text-center w-[15em]` }> Subscribed Questions </h3>
                <div className={`${lSubscriptionBoxClass} overflow-scroll`}>
                    { aSubProps.subscribedQuestions.map((aQuestion: TQuestion) =>
                    {
                        return (
                            <div className="container flex flex-row justify-between px-10 items-center">
                                <div className="container flex flex-row text-center">
                                    <p className={"text-md py-1"}>{aQuestion.name}</p>
                                    <p className="text-md py-1 text-gray">({lSubscribedBanks.find((aSubscribedBank: TBank) =>
                                        aSubscribedBank.questions.find((lQuestion: TQuestion) =>
                                            lQuestion.id === aQuestion.id))?.name})
                                    </p>
                                </div>
                                <span onClick={() => aSubProps.onDeleteQuestion(aQuestion.id)}> <BsXSquareFill className="cursor-pointer" color={"red"}/> </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
};
