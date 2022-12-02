import { useState } from "react";
import { BaseButton } from "../../common"
import { BankDetails  } from "./BankDetails";

export const ShowUser = () =>
{
    const [addBank, setAddBank] = useState<boolean>(false);

    return (
        <div className="container flex flex-row items-center mx-auto w-screen h-screen">
            <div id="panel" className="container bg-white flex flex-col mx-auto items-center justify-center w-1/4 h-full bg-purple ">
                panel
            </div>
            <BankDetails/>
        </div>
    )
}