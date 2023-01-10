import { API, Auth, Cache } from "aws-amplify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actionButtonClass, flexColClass, flexRowClass, headingTextClass, textInputClass } from "../../common";
import { getErrorStyle } from "../../common/utils/GetErrorStyle";
import { userSignedInStatusChange } from "../../reducers/global";
import { SyncLoader } from "react-spinners";
import moment from "moment";
import { TReqUser } from "../../model";

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

type TNewPassword =
{
    password: string,
    confirmPassword: string;
};

interface ILoginDetailsProps
{
    onLoginCancel: () => void;
    onLoginError: (error: any) => void;
    onLoginSuccess: (message: any) => void;
}

export const LoginDetails = (aLoginDetailsProps: ILoginDetailsProps) =>
{
    const [ login, setLogin ] = useState<ILoginDetails>({ email: "", password: "" });

    const [ newPassword, setNewPassword ] = useState<TNewPassword>({ password: "", confirmPassword: ""});
    const [ resetPassword, setResetPassword ] = useState<boolean>(false);
    const [ code, setCode ] = useState<string>("");

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<TError>({ invalidEmail: false, invalidPassword: false, });
    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);

    const dispatch = useDispatch(); 
    const navigate = useNavigate();

    const postUserData = async(lCognitoUser: any) =>
    {
        const lNow = moment.now();
        const lData: TReqUser =
        {
            PK: `UR#${lCognitoUser.attributes.sub}`,
            id: lCognitoUser.attributes.sub,
            lastLoggedIn: lNow,
            createdAt: lNow,
            type: "user",
            givenName: lCognitoUser.attributes.given_name,
            familyName: lCognitoUser.attributes.family_name,
            username: lCognitoUser.attributes.email,
            nickName: lCognitoUser.attributes.nickname,
            email: lCognitoUser.attributes.email,
            subscribedBanks: [""],
            subscribedTests: [""],
        };
    
        const apiName = 'openbank';
        const path = '/user';
        const lReqUser = {
            body: lData,
            headers: {} // OPTIONAL
        };
  
        return API.post(apiName, path, lReqUser);
  }

    const handleResetPassword = async() =>
    {
        if (login.email === "")
        {
            const lError =
            {
                code: "You need to enter an email first",
            }
            aLoginDetailsProps.onLoginError(lError);
            return;
        }
        try
        {
            const lResetRequest = await Auth.forgotPassword(login.email);
            setResetPassword(true);
            console.log(lResetRequest);
        }
        catch(error)
        {
            aLoginDetailsProps.onLoginError(error);
        }
    };

    const handleNewPassword = async() =>
    {
        setLoading(true);
        try
        {
            console.log(login.email, code, newPassword);
            await Auth.forgotPasswordSubmit(login.email, code, newPassword.password);
            const lMessage = { code: "Password changed successfully", severity: "low" };
            aLoginDetailsProps.onLoginSuccess(lMessage);
        }
        catch(error)
        {
            aLoginDetailsProps.onLoginError(error);
        }
        setLoading(false);
    };

    const handleLogin = async() =>
    {
        setTriedSubmitting(true);

        if (error.invalidEmail || error.invalidPassword)
        {
            return;
        }

        setLoading(true);

        try {
            const lLoginResult: any = await Auth.signIn(login.email, login.password);
            const lResponse = await postUserData(lLoginResult);
            // dispatch(postUserData(lLoginResult)); // TODO
            dispatch(
                userSignedInStatusChange({
                    userId: lLoginResult.attributes.sub,
                    lastName: lLoginResult.attributes.family_name,
                    isSignedIn: true
                }));
            console.log(lResponse);
            setLoading(false);
            navigate("/welcome");
        }
        catch (error)
        {
            aLoginDetailsProps.onLoginError(error);
            setLoading(false);
        }
    };

    return (
        <div className="container flex flex-col justify-start py-10 px-5 bg-white
            items-center absolute border-2 top-40 w-[25em] shadow-lg z-100 h-[34em] rounded-md">
            <h3 className={`${headingTextClass}`}> {resetPassword ? "Reset Password" : "Login"} </h3>
            <div className={`${flexColClass} mt-[1em]`}>
                {resetPassword && <div className={`${flexColClass} items-center mt-[1em]`}>
                    <label className={`self-start ml-[1em] font-bold text-lg`}> Verification Code </label>
                    <div>
                    <input
                        type={"text"}
                        className={`${textInputClass} w-[20em] h-[2em] ${getErrorStyle(triedSubmitting, code === "", "BORDER")}`}
                        onChange={(event) => setCode(event.target.value)} />
                        <p className={`text-red text-md pt-1 ${getErrorStyle(triedSubmitting, error.invalidPassword, "OPACITY")}`}>You haven't entered a code.</p>
                    </div>
                </div>
                }
                <div className={`${flexColClass} items-center`}>
                    <label className={`self-start ml-[1em] font-bold text-lg`}> {resetPassword ? "New Password" : "Email" } </label>
                    <div>
                    <input
                        type={resetPassword ? "password" : "email" }
                        className={`${textInputClass} w-[20em] h-[2em] ${getErrorStyle(triedSubmitting, error.invalidEmail, "BORDER")}`}
                        onChange={(event) => resetPassword ? setNewPassword({...newPassword, password: event.target.value }) : setLogin({ ...login, email: event.target.value })} />
                        <p className={`text-red text-md pt-1 ${getErrorStyle(triedSubmitting, error.invalidPassword, "OPACITY")}`}>You haven't entered {resetPassword ? "a password" : "an email"}</p>
                    </div>
                </div>
                <div className={`${flexColClass} items-center mx-auto`}>
                    <label className={`self-start ml-[1em] font-bold text-lg`}> {resetPassword ? "Confirm Password" : "Password"} </label>
                    <div>
                    <input
                        type="password"
                        className={`${textInputClass} w-[20em] h-[2em] ${getErrorStyle(triedSubmitting, error.invalidPassword, "BORDER")}`}
                        onChange={(event) => resetPassword ? setNewPassword({ ...newPassword, confirmPassword: event.target.value }) : setLogin({ ...login, password: event.target.value })} />
                        <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidPassword, "OPACITY")}`}>{resetPassword ? "Password doesn't match" : "You haven't a password."}</p>
                    </div>
                </div>
            </div>
            <div className={`self-center mt-9`}>
                { loading ? <SyncLoader className="mt-[1.6em]" size={18}/>
                          : <button onClick={resetPassword ? handleNewPassword : handleLogin}
                                    className={`${actionButtonClass} w-[12em] font-bold text-lg`}>
                                        {resetPassword ? "Confirm" : "Login"}
                            </button>
                }
            </div>
            {
                !resetPassword && <div className={`${flexRowClass} items-center mt-5 ml-2 justify-around`}>
                <p> 🤦‍♂️ Forgot password?</p>
                <button onClick={handleResetPassword} className="border-none bg-white text-red"> Reset Password </button>
            </div>
            }
            <button
                    type="button"
                    onClick={aLoginDetailsProps.onLoginCancel}
                    className={`self-center border-none mt-2 text-black text-lg`}>
                        Cancel
            </button>
        </div>
    )
}
