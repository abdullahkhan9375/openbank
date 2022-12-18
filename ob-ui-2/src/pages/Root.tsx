import { Outlet } from "react-router-dom";
import { NavPanel } from "./Components/NavPanel";

export const Root = () =>
{
    return (
        <div className="w-screen mx-auto h-screen">
            <div id="panel" className="container bg-purple flex flex-col rounded-sm items-start justify-center w-[70em] h-[5vh] mx-auto">
                <NavPanel/>
            </div>
            <Outlet/>
        </div>
    );
};
