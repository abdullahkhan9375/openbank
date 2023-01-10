import { Auth } from "aws-amplify"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearBankState } from "../../reducers/bank";
import { userSignedInStatusChange } from "../../reducers/global";

interface ISignOutProps
{
    onSignOut: () => void;
}

export const SignOut = (aSignOutProps: ISignOutProps) =>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSignOut = async() =>
    {
        await Auth.signOut();
        dispatch(userSignedInStatusChange(false));
        dispatch(clearBankState());
        aSignOutProps.onSignOut();
        navigate("/home");
    };

    return (
        <div
            onClick={handleSignOut}
            className="text-gray-light mr-3 text-lg font-semibold hover:text-white cursor-pointer">
            Sign Out
        </div>
    )
};