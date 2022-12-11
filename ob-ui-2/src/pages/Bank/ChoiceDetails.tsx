import { isEqual } from "lodash";
import { FormEvent, useEffect, useState } from "react";
import { actioButtonDisabledClass, actionButtonClass, flexColClass, flexRowClass } from "../../common";
import { labelTextClass, textInputClass } from "../../common";
import { TChoice } from "../../model";

interface IChoiceProps
{
    selectedChoice: TChoice;
    onSaveChoice: (aChoice: TChoice) => void;
}

export const ChoiceDetails = (aChoiceProps: IChoiceProps) =>
{
    const [ choice, setChoice ] = useState<TChoice>(aChoiceProps.selectedChoice);
    const [ error, setError ] = useState<boolean>(aChoiceProps.selectedChoice.body === "");
    const [hasChanged, setHasChanged] = useState<boolean>(false);

    const handleSubmit = (event: FormEvent) =>
    {
        if (lSaveDisabled) return;
        aChoiceProps.onSaveChoice(choice);
    };

    useEffect(() =>
    {
       setError(aChoiceProps.selectedChoice.body === "");
       setHasChanged(!isEqual(aChoiceProps.selectedChoice, choice));
    }, [aChoiceProps, choice]);

    useEffect(() =>
    {
        setError(choice.body === "" || choice.body === aChoiceProps.selectedChoice.body);
    }, [choice]);

    const lSaveDisabled: boolean = error || !hasChanged;

    return (
            <div className="w-full mx-3">
                <form onSubmit={handleSubmit}>
                    <div className="">
                        <label className={labelTextClass}> Choice #{choice.id} </label>
                    </div>
                    <div className={`${flexColClass} justify-center mb-1 items-start`}>
                        <div className={`${flexRowClass} justify-between"`}>
                            <input type="text" className={`${textInputClass} w-4/5 ${error ? "border-b-red" : "border-b-green"}`} value={choice.body} onChange={(event) => {setChoice({...choice, body: event.target.value })}
                            }/>
                            <div>
                                <label className={labelTextClass}> Correct </label>
                                <input type="checkbox" className="bg-gray-light" value={String(choice.correct)} checked={choice.correct} onChange={(event) => {setChoice({...choice, correct: event.target.checked })}
                                } />
                            </div>
                        </div>
                        <p className={`text-red text-sm py-1 ${error ? "opacity-1" : "opacity-0"}`}>You haven't entered a choice</p>
                    </div>
                    <div className="">
                        <label className={labelTextClass}> Explanation </label>
                    </div>
                    <div className={flexRowClass}>
                        <input className={`border-b-2 px-3 focus:outline-none w-full h-[80px]`} value={choice.explanation} onChange={(event) => {setChoice({...choice, explanation: event.target.value })}} type="text"/>
                        <button type="button" className={`h-[3em] self-end ${lSaveDisabled ? actioButtonDisabledClass : actionButtonClass} ml-2`} onClick={handleSubmit}><p className="text-lg font-bold"> save </p></button>
                    </div>
                </form>
            </div>
        )
};
