import { Auth } from "@aws-amplify/auth";
import { useCallback, useEffect, useState } from "react";
import { flexColClass,  mainContainerClass } from "../../common";
import { NavPanel } from "../Components/NavPanel";
import { MessagePanel, TMessage } from "../Components/MessagePanel";
import { BankCarousel } from "./BankCarousel";
import { useDispatch } from "react-redux";
import { getBanksForUser } from "../../reducers/bank";
import { AppDispatch } from "../../store";

export const Welcome = () =>
{
    const [ username, setUserName ] = useState<string>("");
    const [ userId, setUserId ] = useState<string>("");

    const [message, setMessage] = useState<TMessage | undefined>(undefined);
    const dispatch = useDispatch<AppDispatch>();

    const memoizedUserInfo = useCallback(() =>
    {
        (async () =>
        {
            try {
                const lCognitoUser: any = await Auth.currentAuthenticatedUser();
                console.log(lCognitoUser);
                setUserName(lCognitoUser.attributes.given_name);
                setUserId(lCognitoUser.attributes.sub);
            }
            catch(error)
            {
                console.log(error);
            }
        })();
    }, []);

    memoizedUserInfo();

    useEffect(() =>
    {
        console.log(userId);
        if (userId !== "")
        {
            dispatch(getBanksForUser(userId));
        }
    }, [userId])

    return (
        <>
            <NavPanel/>
            <div className={mainContainerClass}>
            <h1 className="font-bold mt-4"> Welcome, {username}! </h1>
                <div className={`${flexColClass} mt-10`}>
                    <h3 className="text-3xl font-bold">Explore banks</h3>
                    <BankCarousel/>
                </div>
                <MessagePanel onAcknowledge={() => setMessage(undefined)} {...message}/>
            </div>
        </>
    )
};
