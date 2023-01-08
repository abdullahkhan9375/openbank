import { Cache } from "aws-amplify";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SignOut } from "../Authenticate/SignOut";

export const NavPanel = () =>
{
    const lIsSignedIn = useSelector((state: any) => state.global.user.IsSignedIn);

    const [signedIn, setSignedIn] = useState<boolean>(Cache.getItem("isSignedIn"));

    useEffect(() =>
    {
        setSignedIn(Cache.getItem("isSignedIn"));
    }, [lIsSignedIn]);

    return (
        <div className="container bg-purple flex flex-col rounded-sm items-start justify-center w-[70em] h-[5vh] mx-auto">
            <div className="container flex flex-row justify-between px-4">
                {signedIn
                ? <>
                    <div className="container flex flex-row justify-around bg-purple self-start ml-8 w-[10em]"> 
                        <div className="container flex flex-col px-3 justify-center">
                            <Link to={`/welcome`} className="text-gray-light text-lg font-semibold hover:text-white"> Home </Link>
                        </div>
                        <div className="container flex flex-col px-3 justify-center">
                            <Link to={`/banks`} className="text-gray-light text-lg font-semibold hover:text-white"> Banks </Link>
                        </div>
                        <div className="container flex flex-col px-3 justify-center">
                            <Link to={`/tests`} className="text-gray-light text-lg font-semibold hover:text-white"> Tests </Link>
                        </div>
                    </div>
                    <SignOut onSignOut={() => setSignedIn(false)} />
                </>
                : <></>
                }
            </div>
        </div>
    )
};
