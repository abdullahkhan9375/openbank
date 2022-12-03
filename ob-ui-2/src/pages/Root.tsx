import { Outlet } from "react-router-dom";

export const Root = () =>
{
    return (
        <div className="w-screen mx-auto h-screen bg-gray-light">
            <div id="panel" className="bg-purple flex flex-col items-center justify-start w-[70em] h-[5vh] mx-auto">
                
            </div>
            <Outlet/>
        </div>
    );
};
