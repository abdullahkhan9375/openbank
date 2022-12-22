import { useState } from "react";
import { actionButtonClass, altActionButtonClass, flexColClass, flexRowClass, headingTextClass, labelDivClass, labelTextClass, textInputClass } from "../../common";
import { LoginDetails } from "./LoginDetails";
import { RegisterDetails } from "./RegisterDetails";

interface ISigninDialogProps
{
  onCancel: () => void;
}

export const ShowSignin = (aSigninDialogProps: ISigninDialogProps) =>
{
  const [showRegisterDetails, setShowRegisterDetails ] = useState<boolean>(true);

  return (
  <div className="container flex flex-col justify-start py-10 px-5 items-start absolute top-50 w-[40em] z-100 h-[40em] shadow-md rounded-md">
    <h3 className={`${headingTextClass} ml-5`}> {showRegisterDetails ? "Register" : "Login"} </h3>
    { showRegisterDetails ? <RegisterDetails onLogin={() => setShowRegisterDetails(false)}/> : <LoginDetails/> }
    <button type="button"
      onClick={aSigninDialogProps.onCancel}
      className={`rounded-sm hover:border-0 self-center mt-2 text-black text-lg w-[10em] mx-3`}>
      <p className="text-black font-bold hover:text-black">
          Cancel
      </p>
    </button>
  </div>
  )
}