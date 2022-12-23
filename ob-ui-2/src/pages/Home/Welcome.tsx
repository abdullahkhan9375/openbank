import { useSelector } from "react-redux";
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import { mainContainerClass } from "../../common";
import { NavPanel } from "../Components/NavPanel";

export const Welcome = () =>
{
    const [ username, setUserName ] = useState<string>("");
    useEffect(() =>
    {
        (async() =>
        {
            const lCognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
            console.log(lCognitoUser.getUserData((err, result) => { setUserName(result?.UserAttributes[2].Value ?? "Unknown")}))
        })();
    }, []);
    return (
        <>
            <NavPanel/>
            <div className={mainContainerClass}>
                Welcome {username}!
            </div>
        </>
    )
};
