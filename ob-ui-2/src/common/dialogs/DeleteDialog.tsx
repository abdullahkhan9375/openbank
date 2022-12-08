import { altActionButtonClass } from "../buttons/styles";

interface IDeleteDialogProps
{
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteDialog = (aDeleteDialogProps: IDeleteDialogProps) =>
{
    return (
            <div className={`display-flex flex flex-col relative top-[-23em] mx-auto h-[15em] w-[30em] bg-gray border-2 items-center py-10 justify-around z-100 `}>
                <div>
                    Are you sure you want to delete this item?
                </div>
                <div className="container flex flex-row items-center justify-around w-[18em]">
                    <button onClick={aDeleteDialogProps.onCancel}>
                        No
                    </button>
                    <button
                        className={`${altActionButtonClass} w-[5em] text-white font-bold text-lg`}
                        onClick={aDeleteDialogProps.onConfirm}>
                        Yes
                    </button>
                </div>
            </div>
    )
};