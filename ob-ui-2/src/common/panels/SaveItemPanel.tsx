import { useNavigate } from "react-router-dom";
import { actioButtonDisabledClass, altActionButtonClass } from "../buttons/styles";

interface ISaveItemPanel
{
    saveText: string;
    cancelLink?: string;
    onSave: () => void;
    onCancel?: () => void;
    error: boolean;
}

export const SaveItemPanel = (aSaveItemPanelProps: ISaveItemPanel) => //I don't like this name.
{
    const navigate = useNavigate();

    const handleCancel = () =>
    {
        if (aSaveItemPanelProps.cancelLink !== undefined)
        {
            navigate(`${aSaveItemPanelProps.cancelLink}`);
        }
        if (aSaveItemPanelProps.onCancel !== undefined)
        {
            aSaveItemPanelProps.onCancel();
        }
    }
    return (
        <>
            <button type="button"
                onClick={handleCancel}
                className={`rounded-sm hover:border-0 border-none hover:border-none text-black text-lg w-[10em] mx-3`}>
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