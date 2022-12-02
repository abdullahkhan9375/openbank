import React from "react";

interface IBaseButton {
    children: any;
    onClick?: ((aValue: any) => void);
    color?: string;
    width?: string;
}

export const BaseButton = (aProps: IBaseButton) => {
    return (
        <button onClick={aProps.onClick} className={`border-2 border-${aProps.color ?? "blue"} bg-aqua font-extrabold shadow-sm rounded-sm text-2xl px-2 py-2 mr-3 w-full`}>
            {aProps.children}
        </button>
    )
}
