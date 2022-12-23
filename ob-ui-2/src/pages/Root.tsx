import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { NavPanel } from "./Components/NavPanel";

export const Root = () =>
{
    return (
        <div className="w-screen mx-auto h-screen">
            <Outlet/>
        </div>
    );
};
