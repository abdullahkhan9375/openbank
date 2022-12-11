import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import { altActionButtonClass } from "../../common";

type THoverOption =
{
    name: string,
    link: string,
};

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
        onMouseLeave={() => setIsHovering(false)} className={`container flex absolute flex-col cursor-pointer top-3 text-black text-xl justify-start items-center ${isHovering ? "h-[5em]" : "h-[2em]"}  hover:bg-purple hover:text-white w-[4em]`}>
            <div className={`text-white`} >
                {aHoverBarProps.children}
            </div>
            { isHovering &&
            <div>
                {
                    aHoverBarProps.options.map((aHoverOption: THoverOption) =>
                    {
                        return (
                            <div className="container flex flex-col justify-center">
                                <Link to={`/${aHoverOption.link}`} className="text-gray hover:text-white"> {aHoverOption.name} </Link>
                            </div>
                        )
                    })
                }
            </div>
            }
        </div>
    )
};

export const NavPanel = () =>
{
    return (
        <div className="py-10">
            <HoverBar options={[{ name: "Banks", link: "banks"}, {name: "Tests", link: "tests"}]}>
                Prep
            </HoverBar>
        </div>
    )
};
