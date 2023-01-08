import { TMessage } from "../../pages/Components/MessagePanel";

export const handleMessage = (message: any): TMessage =>
{
    switch (message.code)
    {
        case "UsernameExistsException":
            return { severity: "high", message: "You already have an account"};
        
        case "UserNotFoundException":
            return { severity: "high", message: "This account does not exist"};

        case "NotAuthorizedException":
            return { severity: "high", message: "Your password is incorrect"};
        
        default:
            return { severity: message.severity ?? "high", message: message.code };
    }
};
