import { Auth } from "@aws-amplify/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { flexColClass,  mainContainerClass } from "../../common";
import { NavPanel } from "../Components/NavPanel";
import { MessagePanel, TMessage } from "../Components/MessagePanel";
import { BankCarousel } from "./BankCarousel";
import { useDispatch } from "react-redux";
import { getBanksForUser } from "../../reducers/bank";
import { AppDispatch } from "../../store";
import { Cache } from "aws-amplify";

type TName =
{
    firstName: "",
    lastName: "",
};

export const Welcome = () =>
{
    const [ name, setName ] = useState<TName>({ firstName: "", lastName: "" });
    const [ userId, setUserId ] = useState<string>("");
    const [ page, setPage ] = useState<number>(1);

    const [message, setMessage] = useState<TMessage | undefined>(undefined);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() =>
    {
        (async () =>
        {
            try {
                const lCognitoUser: any = await Auth.currentAuthenticatedUser();
                setName({ firstName: lCognitoUser.attributes.given_name, lastName: lCognitoUser.attributes.family_name });
                setUserId(lCognitoUser.attributes.sub);
            }
            catch(error)
            {
                console.log(error);
            }
        })();
    }, []);

    return (
        <>
            <NavPanel/>
            <div className={mainContainerClass}>
            <h1 className="font-bold mt-4"> Welcome, {name.firstName}! </h1>
                <div className={`${flexColClass} mt-10`}>
                    <h3 className="text-3xl font-bold">Explore banks</h3>
                    <BankCarousel/>
                    <input />
                </div>
                <MessagePanel onAcknowledge={() => setMessage(undefined)} {...message}/>
            </div>
        </>
    )
};
