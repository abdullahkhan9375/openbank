import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { actionButtonClass, altActionButtonClass, flexColClass, flexRowClass, labelDivClass, labelTextClass, textInputClass } from "../../common"
import { getErrorStyle } from "../../common/utils/GetErrorStyle";

interface IRegisterDetailProps
{
    onLogin: () => void;
}

type TRegister =
{
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
};

type TError =
{
    invalidFirstName: boolean,
    invalidLastName: boolean,
    invalidUsername: boolean,
    invalidEmail: boolean,
    invalidPassword: boolean,
    invalidConfirmPassword: boolean,
};

const lEmptyRegister: TRegister =
{
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const lInitialError: TError =
{
    invalidFirstName: false,
    invalidLastName: false,
    invalidEmail: false,
    invalidUsername: false,
    invalidPassword: false,
    invalidConfirmPassword: false,
};

export const RegisterDetails = (aRegisterDetailProps: IRegisterDetailProps) =>
{
    const [ register, setRegister ] = useState<TRegister>(lEmptyRegister);

    const [ triedSubmitting, setTriedSubmitting ] = useState<boolean>(false);
    const [ error, setError ] = useState<TError>(lInitialError);

    useEffect(() =>
    {
        // Review this. TODO

        setError({
            invalidFirstName: register.firstName === lEmptyRegister.firstName,
            invalidLastName: register.lastName === lEmptyRegister.lastName,
            invalidEmail: register.email === lEmptyRegister.email,
            invalidUsername: register.username === lEmptyRegister.username,
            invalidPassword: register.password === lEmptyRegister.password,
            invalidConfirmPassword: register.password !== register.confirmPassword || register.confirmPassword === lEmptyRegister.confirmPassword,
        });

    }, [register]);

    const handleSubmitRegister = () =>
    {
        setTriedSubmitting(true);

        if (Object.values(error).includes(true))
        {
            return;
        }
        console.log("Register: ", register);
    }

    return (
        <>
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
                    <label className={labelTextClass}> Username </label>
                    <div>
                        <input
                            type="text"
                            className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidUsername, "BORDER")}`}
                            onChange={(event) => setRegister({ ...register, username: event.target.value })}/>
                        <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidUsername, "OPACITY")}`}>You haven't entered a username.</p>
                    </div>
                </div>
                <div className={labelDivClass}>
                        <label className={labelTextClass}> Email </label>
                    <div>
                        <input
                            type="text"
                            className={`${textInputClass} w-[15em] ${getErrorStyle(triedSubmitting, error.invalidEmail, "BORDER")}`}
                            onChange={(event) => setRegister({ ...register, email: event.target.value })}/>
                        <p className={`text-red text-sm pt-1 ${getErrorStyle(triedSubmitting, error.invalidEmail, "OPACITY")}`}>You haven't entered an email.</p>
                    </div>
                </div>
            </div>
            <div className={`${flexRowClass} w-[100%] ml-6 mt-2`}>
                <div className={labelDivClass}>
                    <label className={labelTextClass}> Password </label>
                <div>
                    <input
                        type="text"
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
                    <div className="self-start mt-9 ml-6">
                        <button onClick={handleSubmitRegister} className={`${actionButtonClass} w-[12em] font-bold text-lg`}> Register </button> 
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
        </>
    )
}