import { Outlet } from "react-router-dom";
import { NavPanel } from "./Components/NavPanel";

export const Root = () =>
{
    return (
        <div className="w-screen mx-auto h-screen bg-gray-light">
            <div id="panel" className="bg-purple flex flex-col items-end justify-center w-[70em] h-[5vh] mx-auto">
                <NavPanel/>
            </div>
            <Outlet/>
        </div>
    );
};
