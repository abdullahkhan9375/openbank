import { useState } from "react";
import { BaseButton } from "../../common"
import { BankDetails  } from "./BankDetails";

export const ShowUser = () =>
{
    const [addBank, setAddBank] = useState<boolean>(false);

    return (
        <div className="container flex flex-row items-center w-screen h-screen">
            <div id="panel" className="bg-black flex flex-col items-center justify-center w-[30em] h-full">
                <p className="bg-gray-light">panel</p>
            </div>
            <BankDetails/>
        </div>
    )
}