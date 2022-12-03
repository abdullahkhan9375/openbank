import { useState } from "react";
import { BaseButton } from "../../common"
import { BankDetails  } from "./BankDetails";

export const ShowUser = () =>
{
    const [addBank, setAddBank] = useState<boolean>(false);

    return (
        <>
        <div className="container flex flex-col bg-gray-light w-[70em] h-[95vh] bg-white mx-auto items-center justify-between">
            <BankDetails/>
        </div>
        </>
    )
}