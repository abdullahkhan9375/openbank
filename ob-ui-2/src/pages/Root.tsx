import { Outlet } from "react-router-dom";

export const Root = () =>
{
    return (
        <div className="w-screen h-screen bg-purple">
            <Outlet/>
        </div>
    );
};
