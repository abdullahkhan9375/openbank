import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionButtonClass, headingTextClass } from "../../common"
import { userLoggedIn, userSignedInStatusChange } from "../../reducers/global";
import { ISignUpResult, CognitoUser } from 'amazon-cognito-identity-js';
import { Cache } from "aws-amplify";

interface IVerificationProps
{
    signUpResult: ISignUpResult
}

export const Verification = (aVerificationProps: IVerificationProps) =>
{
    const [ confirmationCode, setConfirmationCode ] = useState<string>("");
    const lUser = aVerificationProps.signUpResult;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleConfirmCode = async() =>
    {
        await aVerificationProps.signUpResult.user.confirmRegistration(confirmationCode, true, (err: any, result: any) => {
            if (err) {
             console.log('error', err.message);
             return;
            }
            console.log('call result: ' + JSON.stringify(result));
            Cache.setItem("isSignedIn", true);
            dispatch(userSignedInStatusChange(true));
            navigate("/welcome");
           });
    };

    return (
        <>
            <h3 className={headingTextClass}> You should've received a code.</h3>
            <div>
                <label> Verification Code </label>
                <input
                    type="text"
                    onChange={(event) => setConfirmationCode(event.target.value)}/>
                <button onClick={handleConfirmCode} className={actionButtonClass}> Confirm </button>
            </div>
        </>
    )
}