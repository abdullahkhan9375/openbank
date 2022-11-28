import React from "react";

interface IBaseButton {
    children: any;
    onClick?: ((aValue: any) => void);
    color?: string;
    width?: string;
}

export const BaseButton = (aProps: IBaseButton) => {
    return (
        <button onClick={aProps.onClick} className={`border-2 border-${aProps.color ?? "blue"} rounded-sm text-xl px-2 py-2 mr-3 w-${aProps.width ?? "full"}}`}>
            {aProps.children}
        </button>
    )
}
