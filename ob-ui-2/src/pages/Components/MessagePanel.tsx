import { BsFillCheckCircleFill, BsFillExclamationCircleFill, BsFillXCircleFill } from "react-icons/bs";

interface IMessagePanel
{
    severity: "low" | "medium" | "high";
    message: string;
}

export const MessagePanel = (aMessagePanelProps: IMessagePanel) =>
{
    const lMessageColor =
    {
        "low": "border-purple text-purple",
        "medium": "border-orange text-orange",
        "high": "border-red text-red",
    }

    const lIcon = () =>
    {
        if (aMessagePanelProps.severity === "high") return <BsFillXCircleFill className="text-red mx-2 my-2" size={25}/>
        else if (aMessagePanelProps.severity === "medium") return <BsFillExclamationCircleFill className="text-orange mx-2 my-2" size={25}/>
        return <BsFillCheckCircleFill className="text-purple mx-2 my-2 " size={25}/>
    }

    return (
        <div
            className={`container flex flex-row opacity-75 shadow-lg border-[2px] rounded-md
            items-center justify-center mx-auto w-[30em] h-[4em] absolute z-100 top-[80vh]
                ${lMessageColor[aMessagePanelProps.severity]}`}>
            <p className="text-lg text-center font-semibold">
                {aMessagePanelProps.message}
            </p>
            {lIcon()}
        </div> 
    );
};
