import { useNavigate } from "react-router-dom";
import { actioButtonDisabledClass, altActionButtonClass } from "../buttons/styles";

interface ISaveItemPanel
{
    saveText: string;
    cancelLink: string;
    onSave: () => void;
    error: boolean;
}

export const SaveItemPanel = (aSaveItemPanelProps: ISaveItemPanel) => //I don't like this name.
{
    const navigate = useNavigate();
    return (
        <>
            <button type="button"
                onClick={() => navigate(`${aSaveItemPanelProps.cancelLink}`)}
                className={`rounded-sm hover:border-0 text-black text-lg w-[10em] mx-3`}>
                <p className="text-black font-bold hover:text-black">
                    Cancel
                </p>
            </button>
            <button type="button" onClick={aSaveItemPanelProps.onSave} className={`${aSaveItemPanelProps.error
                    ? `${actioButtonDisabledClass} w-[10em] mx-3`
                    : `${altActionButtonClass} w-[10em] mx-3 text-white`}`}>
                        <p className="font-bold text-lg">{aSaveItemPanelProps.saveText}</p>
            </button>
        </>
    )
}