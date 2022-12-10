import { Link } from "react-router-dom";
import { actioButtonDisabledClass, altActionButtonClass } from "../buttons/styles";

interface ISaveItemPanel
{
    cancelLink: string;
    onSave: () => void;
    error: boolean;
}

export const SaveItemPanel = (aSaveItemPanelProps: ISaveItemPanel) => //I don't like this name.
{
    return (
        <>
            <button type="button" className={`bg-white hover:border-white text-black text-lg w-[10em] mx-3`}>
                <Link to={aSaveItemPanelProps.cancelLink} className="text-black hover:text-black">
                    Cancel
                </Link>
            </button>
            <button type="button" onClick={aSaveItemPanelProps.onSave} className={`${aSaveItemPanelProps.error
                    ? `${actioButtonDisabledClass} text-lg w-[10em] mx-3`
                    : `${altActionButtonClass} text-gray-light text-lg w-[10em] mx-3 hover:border-white`}`}>
                        Save
            </button>
        </>
    )
}