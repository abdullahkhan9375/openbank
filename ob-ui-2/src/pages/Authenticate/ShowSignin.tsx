import { useState } from "react";
import { TMessage } from "../Components/MessagePanel";
import { LoginDetails } from "./LoginDetails";
import { RegisterDetails } from "./RegisterDetails";

interface ISigninDialogProps
{
  onCancel: () => void;
  onFailure: (error: any) => void;
  onSuccess: (message: TMessage) => void;
}

export const ShowSignin = (aSigninDialogProps: ISigninDialogProps) =>
{
  const [showRegisterDetails, setShowRegisterDetails ] = useState<boolean>(true);

  if (showRegisterDetails)
  {
    return <RegisterDetails onRegisterationError={aSigninDialogProps.onFailure}
                            onRegisterationCancel={aSigninDialogProps.onCancel}
                            onRegisterationSuccess={aSigninDialogProps.onSuccess}
                            onLogin={() => setShowRegisterDetails(false)}/>;
  }

  return <LoginDetails
            onLoginError={aSigninDialogProps.onFailure}
            onLoginSuccess={aSigninDialogProps.onSuccess}
            onLoginCancel={aSigninDialogProps.onCancel}
          />;
};
