import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import { altActionButtonClass } from "../../common";

type THoverOption =
{
    name: string,
    link: string,
}

interface IHoverBarProps
{
    options: THoverOption[],
    children: any,
}

const HoverBar = (aHoverBarProps: IHoverBarProps) =>
{
    const [ isHovering, setIsHovering ] = useState<boolean>(false);
    return (
        <div onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)} className={`container flex absolute flex-col cursor-pointer top-1 text-black text-xl justify-start items-center ${isHovering ? "h-[5em]" : "h-[2em]"}  hover:bg-gray-light hover:text-black hover:border-2 w-[4em]`}>
            <div className={`${isHovering ? "text-black" : "text-white"}`} >
            
                {aHoverBarProps.children}
            </div>
            { isHovering &&
            <div>
                {
                    aHoverBarProps.options.map((aHoverOption: THoverOption) =>
                    {
                        return (
                            <div className="container flex flex-col justify-center">
                                <Link to={`/${aHoverOption.link}`}> {aHoverOption.name} </Link>
                            </div>
                        )
                    })
                }
            </div>
            }
        </div>
    )
}

export const NavPanel = () =>
{
    return (
        <div className="p-5">
            <HoverBar options={[{ name: "Banks", link: "banks"}, {name: "Tests", link: "tests"}]}>
                Prep
            </HoverBar>
        </div>
    )
};
