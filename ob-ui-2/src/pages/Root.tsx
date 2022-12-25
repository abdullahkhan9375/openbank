import { Outlet } from "react-router-dom";

export const Root = () =>
{
    return (
        <div className="w-screen mx-auto h-screen">
            <Outlet/>
        </div>
    );
};
