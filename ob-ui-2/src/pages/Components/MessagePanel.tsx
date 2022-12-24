import { BsFillCheckCircleFill, BsFillExclamationCircleFill, BsFillXCircleFill } from "react-icons/bs";
import React, { useRef, useEffect, useState } from "react";

export type TMessage =
{
    severity?: "low" | "medium" | "high";
    message?: string;
}
export interface IMessagePanelProps
{
    severity?: "low" | "medium" | "high";
    message?: string;
    onAcknowledge: () => void;
}

export const MessagePanel = (aMessagePanelProps: IMessagePanelProps) =>
{
    console.log(aMessagePanelProps);
    const [visible, setVisible] = useState<boolean>(aMessagePanelProps.message !== undefined);
    console.log(visible);
    const wrapperRef = useRef<any>();

    useEffect(() => { setVisible(aMessagePanelProps.message !== undefined)}, [aMessagePanelProps]);

    useEffect(() =>
    {
        const handleClickOutside = (event: any) =>
        {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target))
          {
            setVisible(false);
            aMessagePanelProps.onAcknowledge();
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
        {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [wrapperRef]);

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
    };

    if (visible)
    {
        return (
                <div
                ref={wrapperRef}
                className={`container flex flex-row opacity-100 bg-white shadow-lg border-[2px] rounded-md
                items-center justify-center mx-auto w-[30em] h-[4em] absolute z-100 top-[80vh]
                    ${lMessageColor[aMessagePanelProps.severity!]}`}>
                <p className="text-lg text-center font-semibold">
                    {aMessagePanelProps.message}
                </p>
                {lIcon()}
                </div>
            );
    }

    return (<></>);
};
