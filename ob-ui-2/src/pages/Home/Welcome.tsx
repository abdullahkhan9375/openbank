import { useSelector } from "react-redux";
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import { mainContainerClass } from "../../common";
import { NavPanel } from "../Components/NavPanel";
import { MessagePanel, TMessage } from "../Components/MessagePanel";

export const Welcome = () =>
{
    const [ username, setUserName ] = useState<string>("");
    
    const [message, setMessage] = useState<TMessage | undefined>(undefined);

    useEffect(() =>
    {
        (async() =>
        {
            try {
                const lCognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
                console.log(lCognitoUser);
            }
            catch(error)
            {
                console.log(error);
                setMessage({ severity: "high", message: "Error" })
            }
        })();
    }, []);
    return (
        <>
            <NavPanel/>
            <div className={mainContainerClass}>
                Welcome {username}!
                <MessagePanel onAcknowledge={() => setMessage(undefined)} {...message}/>
            </div>

        </>
    )
};
