import { Auth } from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import { mainContainerClass } from "../../common";
import { NavPanel } from "../Components/NavPanel";
import { MessagePanel, TMessage } from "../Components/MessagePanel";
import { Hub } from 'aws-amplify';

export const Welcome = () =>
{
    const [ username, setUserName ] = useState<string>("");
    
    const [message, setMessage] = useState<TMessage | undefined>(undefined);

    // function listenToAutoSignInEvent() {
    //     Hub.listen('auth', ({ payload }) => {
    //         const { event } = payload;
    //         if (event === 'autoSignIn') {
    //             const user = payload.data;
    //             console.log("Hub", user);
    //         } else if (event === 'autoSignIn_failure') {
    //             console.log("Nope")
    //         }
    //     })
    // }

    useEffect(() =>
    {
        (async() =>
        {
            try {
                const lCognitoUser: any = await Auth.currentAuthenticatedUser();
                console.log(lCognitoUser);
                setUserName(lCognitoUser.attributes.given_name);
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
                Welcome {username}!
                <MessagePanel onAcknowledge={() => setMessage(undefined)} {...message}/>
            </div>

        </>
    )
};
