import { useState } from "react";
import { actionButtonClass, flexColClass, flexRowClass,
         headingTextClass, labelTextClass, textInputClass
        } from "../../common";
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth} from "aws-amplify";
import { TMessage } from "../Components/MessagePanel";
import { LoginDetails } from "./LoginDetails";

interface IVerificationProps
{
    username: string;
    signUpResult: ISignUpResult;
    onVerificationSuccess: (message: TMessage) => void;
    onVerificationCancel: () => void;
    onLoginFailure: () => void;
    onLoginError: (error: any) => void;
    onLoginSuccess: (message: TMessage) => void;
}

export const Verification = (aVerificationProps: IVerificationProps) =>
{
    const [ confirmationCode, setConfirmationCode ] = useState<string>("");
    const [ showLogin, setShowLogin ] = useState<boolean>(false);

    const handleResendCode = async() =>
    {
        try {
            await Auth.resendSignUp(aVerificationProps.username);
            const lMessage: TMessage =
            {
                message: "A new code has been sent",
                severity: "low",
            }
            aVerificationProps.onVerificationSuccess(lMessage);
            setShowLogin(true);
        } catch (error) {
            aVerificationProps.onVerificationSuccess({ severity: "high", message: "Error" });
        }
    };

    const handleConfirmCode = async() =>
    {
        aVerificationProps.signUpResult.user.confirmRegistration(confirmationCode, true, (err: any, result: any) => {
            if (err) {
             console.log('error', err.message);
             return;
            }
            console.log('call result: ' + JSON.stringify(result));
            setShowLogin(true);
           });
    };

    if (showLogin)
    {
        return <LoginDetails
                onLoginError={aVerificationProps.onLoginError}
                onLoginSuccess={aVerificationProps.onLoginSuccess}
                onLoginCancel={aVerificationProps.onLoginFailure}
            />;
    }
    return (
        <div className="container flex flex-col justify-start py-10 px-5 bg-white
        items-center absolute border-2 top-60 w-[30em] h-[25em] z-100 rounded-md">
            <h3 className={`text-2xl ${headingTextClass} self-center`}> You should've received a code.</h3>
            <div className={`${flexColClass} items-center`}>
                <label className={`${labelTextClass} text-center mt-10`}> Verification Code </label>
                <input
                    type="text"
                    className={`${textInputClass} w-[8em]`}
                    onChange={(event) => setConfirmationCode(event.target.value)}/>
                <button onClick={handleConfirmCode} className={`${actionButtonClass} mt-10 w-[8em]`}> Confirm </button>
            </div>
            <div className={`${flexRowClass} items-center mt-5 ml-2 justify-around`}>
                <p> 🤦‍♂️ Didn't receive the code? </p>
                <button onClick={handleResendCode} className="border-none bg-white text-red"> Resend code </button>
            </div>
            <button
                    type="button"
                    onClick={aVerificationProps.onVerificationCancel}
                    className={`self-center border-none mt-2 text-black text-lg`}>
                        Cancel
            </button>
        </div>
    );
};
