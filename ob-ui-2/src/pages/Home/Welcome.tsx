import { Auth } from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import { mainContainerClass } from "../../common";
import { NavPanel } from "../Components/NavPanel";
import { MessagePanel, TMessage } from "../Components/MessagePanel";
import { API } from 'aws-amplify';

export const Welcome = () =>
{
    const [ username, setUserName ] = useState<string>("");
    
    const [message, setMessage] = useState<TMessage | undefined>(undefined);

    useEffect(() =>
    {
        (async() =>
        {
            try {
                const lCognitoUser: any = await Auth.currentAuthenticatedUser();
                // console.log(lCognitoUser);
                setUserName(lCognitoUser.attributes.given_name);
            }
            catch(error)
            {
                console.log(error);
            }
        })();

        // (async function() {
        //     const response = await getData();
        //     console.log(response);
        //   })();
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
