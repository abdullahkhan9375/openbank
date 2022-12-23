import { Auth, Cache } from "aws-amplify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionButtonClass, flexColClass, labelDivClass, labelTextClass, textInputClass } from "../../common";
import { getErrorStyle } from "../../common/utils/GetErrorStyle";
import { userSignedInStatusChange } from "../../reducers/global";
import { CognitoUser }  from 'amazon-cognito-identity-js';
import { SyncLoader } from "react-spinners";

interface ILoginDetails
{
    email: string,
    password: string,
}

type TError =
{
    invalidEmail: boolean,
    invalidPassword: boolean,
};

export const LoginDetails = () =>
{
    const [ login, setLogin ] = useState<ILoginDetails>({ email: "", password: "" });

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<TError>({ invalidEmail: false, invalidPassword: false, });
    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);

    const dispatch = useDispatch(); 
    const navigate = useNavigate();

    const handleLogin = async() =>
    {
        setTriedSubmitting(true);

        if (error.invalidEmail || error.invalidPassword)
        {
            return;
        }
        setLoading(true);
        try {
            const lLoginResult: CognitoUser = await Auth.signIn(login.email, login.password);
            setLoading(false);
            console.log(lLoginResult);
            Cache.setItem("isSignedIn", true);
            dispatch(userSignedInStatusChange(true));
            navigate("/welcome");
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    return (
        <div className="mt-[5em] mb-20">
            <div className={`${flexColClass} w-[100%] ml-6 mt-5`}>
                <div className={`${labelDivClass} my-[1em]`}>
                    <label className={labelTextClass}> Email </label>
                    <div>
                    <input
                        type="email"
                        className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidEmail, "BORDER")}`}
                        onChange={(event) => setLogin({ ...login, email: event.target.value })} />
                        <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidPassword, "OPACITY")}`}>You haven't entered an email.</p>
                    </div>
                </div>
                <div className={`${labelDivClass} my-[1em]`}>
                    <label className={labelTextClass}> Password </label>
                    <div>
                    <input
                        type="password"
                        className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidPassword, "BORDER")}`}
                        onChange={(event) => setLogin({ ...login, password: event.target.value })} />
                        <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidPassword, "OPACITY")}`}>You haven't a password.</p>
                    </div>
                </div>
            </div>
            {
                loading
                    ? <SyncLoader/>
                    : <div className={`self-start mt-9 ml-6`}>
                        <button onClick={handleLogin} className={`${actionButtonClass} w-[12em] font-bold text-lg`}> Login </button> 
                      </div>
            }
            
        </div>
    )
}
