import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { actionButtonClass, altActionButtonClass, flexColClass, flexRowClass, headingTextClass, labelDivClass, labelTextClass, textInputClass } from "../../common"
import { getErrorStyle } from "../../common/utils/GetErrorStyle";
import { Auth } from 'aws-amplify';
import { Verification } from "./Verification";
import { ISignUpResult, CognitoUser } from 'amazon-cognito-identity-js';
import { TMessage } from "../Components/MessagePanel";
import { SyncLoader } from "react-spinners";

interface IRegisterDetailProps
{
    onLogin: () => void;
    onRegisterationError: (error: any) => void;
    onRegisterationCancel: () => void;
    onRegisterationSuccess: (message: TMessage) => void;
}

type TRegister =
{
    firstName: string,
    lastName: string,
    nickname: string,
    email: string,
    password: string,
    confirmPassword: string,
};

type TError =
{
    invalidFirstName: boolean,
    invalidLastName: boolean,
    invalidNickname: boolean,
    invalidEmail: boolean,
    invalidPassword: boolean,
    invalidConfirmPassword: boolean,
};

const lEmptyRegister: TRegister =
{
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const lInitialError: TError =
{
    invalidFirstName: false,
    invalidLastName: false,
    invalidEmail: false,
    invalidNickname: false,
    invalidPassword: false,
    invalidConfirmPassword: false,
};

export const RegisterDetails = (aRegisterDetailProps: IRegisterDetailProps) =>
{
    const [ signUpResult, setSignUpResult ] = useState<ISignUpResult | undefined>(undefined);
    const [ register, setRegister ] = useState<TRegister>(lEmptyRegister);
    const [ showVerification, setShowVerification ] = useState<boolean>(false);
    const [ cognitoUser, setCognitoUser] = useState<any>(undefined);

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);
    const [ error, setError ] = useState<TError>(lInitialError);

    useEffect(() =>
    {
        // Review this. TODO

        setError({
            invalidFirstName: register.firstName === lEmptyRegister.firstName,
            invalidLastName: register.lastName === lEmptyRegister.lastName,
            invalidEmail: register.email === lEmptyRegister.email,
            invalidNickname: register.nickname === lEmptyRegister.nickname,
            invalidPassword: register.password === lEmptyRegister.password,
            invalidConfirmPassword: register.password !== register.confirmPassword
                                    || register.confirmPassword === lEmptyRegister.confirmPassword,
        });

    }, [register]);

    const handleSubmitRegister = async () =>
    {
        setTriedSubmitting(true);

        if (Object.values(error).includes(true))
        {
            return;
        }
        setLoading(true);
        try {
            const result: ISignUpResult = await Auth.signUp({
                username: register.email,
                password: register.password,
                attributes: {
                    given_name: register.firstName,
                    family_name: register.lastName,
                    email: register.email,
                    nickname: register.nickname,
                },
                autoSignIn: {
                    enabled: true,
                }
            });
            console.log(result);
            setSignUpResult(result);
            setShowVerification(true);
        }
        catch (error) { aRegisterDetailProps.onRegisterationError(error); }
        setLoading(false);
    };

    if (showVerification)
    {
        return <Verification
                username={register.email}
                onVerificationSuccess={aRegisterDetailProps.onRegisterationSuccess}
                signUpResult={signUpResult!}
                onVerificationCancel={aRegisterDetailProps.onRegisterationCancel}
                onLoginError={aRegisterDetailProps.onRegisterationError}
                onLoginFailure={aRegisterDetailProps.onRegisterationCancel}
                onLoginSuccess={aRegisterDetailProps.onRegisterationSuccess}
        />;
    }

    return (
        <div className="container flex flex-col justify-start py-10 px-5 bg-white items-start absolute border-2 top-50 w-[40em] z-100 h-[40em] rounded-md">
            <h3 className={`${headingTextClass} ml-5`}> Register with Openbank </h3>
            <div className={`${flexRowClass} w-[100%] ml-6 mt-2`}>
                    <div className={labelDivClass}>
                        <label className={labelTextClass}> First Name </label>
                    <div>
                        <input
                            type="text"
                            className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidFirstName, "BORDER")}`}
                            onChange={(event) => setRegister({ ...register, firstName: event.target.value })} />
                            <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidFirstName, "OPACITY")}`}>You haven't entered a first name</p>
                        </div>
                    </div>
                    <div className={labelDivClass}>
                        <label className={labelTextClass}> Last Name </label>
                        <div>
                            <input
                                type="text"
                                className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidLastName, "BORDER")}`}
                                onChange={(event) => setRegister({ ...register, lastName: event.target.value })}/>
                            <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidLastName, "OPACITY")}`}>You haven't entered a last name</p>
                        </div>
                    </div>
                </div>
                <div className={`${flexRowClass} w-[100%] ml-6 mt-2`}>
                    <div className={labelDivClass}>
                            <label className={labelTextClass}> Email </label>
                        <div>
                            <input
                                type="email"
                                className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidEmail, "BORDER")}`}
                                onChange={(event) => setRegister({ ...register, email: event.target.value })}/>
                            <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidEmail, "OPACITY")}`}>You haven't entered an email.</p>
                        </div>
                    </div>
                    <div className={labelDivClass}>
                        <label className={labelTextClass}> Nickname </label>
                        <div>
                            <input
                                type="text"
                                className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidNickname, "BORDER")}`}
                                onChange={(event) => setRegister({ ...register, nickname: event.target.value })}/>
                            <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidNickname, "OPACITY")}`}>You haven't entered a nickname. </p>
                        </div>
                    </div>
                </div>
                <div className={`${flexRowClass} w-[100%] ml-6 mt-2`}>
                    <div className={labelDivClass}>
                        <label className={labelTextClass}> Password </label>
                    <div>
                        <input
                            type="password"
                            className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidPassword, "BORDER")}`}
                            onChange={(event) => setRegister({ ...register, password: event.target.value })}/>
                        <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidPassword, "OPACITY")}`}>You haven't entered a password</p>
                    </div>
                    </div>
                    <div className={labelDivClass}>
                        <label className={labelTextClass}> Confirm Password </label>
                        <div>
                            <input
                                type="text"
                                className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidConfirmPassword, "BORDER")}`}
                                onChange={(event) => setRegister({ ...register, confirmPassword: event.target.value })}/>
                            <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidConfirmPassword, "OPACITY")}`}>Passwords don't match.</p>
                        </div>
                    </div>
                </div>
                <div className={flexRowClass}>
                    <div className={flexColClass}>
                        <div className={`ml-6`}>
                            { loading
                                ? <SyncLoader
                                          className="mt-[1.6em]" size={18}
                                    />
                                : <button onClick={handleSubmitRegister}
                                          className={`${actionButtonClass} w-[12em] font-bold text-lg`}>
                                            Register
                                  </button>
                            }
                        </div>
                        <div className={`${flexColClass} mt-9 ml-6`}>
                            <label className={labelTextClass}> Already have an account? </label>
                            <button onClick={aRegisterDetailProps.onLogin} className={`${altActionButtonClass} w-[12em] text-white font-bold text-lg mt-4`}> Login </button> 
                        </div>
                    </div>
                    <div className={`${flexColClass} mt-10`}>
                        <label className={labelTextClass}> Login using: </label>
                        <button className="w-[10em] my-2 bg-gray-light"> Google </button>
                        <button className="w-[10em] my-2 bg-gray-light"> Apple </button>
                    </div>
                </div>
            <button
                    type="button"
                    onClick={aRegisterDetailProps.onRegisterationCancel}
                    className={`rounded-sm hover:border-0 self-center mt-2 text-black text-lg w-[10em] mx-3`}>
                <p className="text-black font-bold hover:text-black">
                    Cancel
                </p>
            </button>
    </div>
    )
}