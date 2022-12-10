import { FormEvent, useEffect, useState } from "react";
import { actioButtonDisabledClass, actionButtonClass } from "../../common";
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
    const [ error, setError ] = useState<boolean>(true);

    const handleSubmit = (event: FormEvent) =>
    {
        if (error) return;
        console.log("Choice: ", choice);
        aChoiceProps.onSaveChoice(choice);
    };

    useEffect(() =>
    {
       setChoice(aChoiceProps.selectedChoice);
       setError(true);
    }, [aChoiceProps]);

    useEffect(() =>
    {
        setError(choice.body === "" || choice.body === aChoiceProps.selectedChoice.body);
    }, [choice]);

    return (
            <div className="w-full mx-3">
                <form onSubmit={handleSubmit}>
                    <div className="mb-1">
                        <label className={labelTextClass}> Choice #{choice.id} </label>
                    </div>
                    <div className="mb-1">
                        <input type="text" className={`${textInputClass} w-4/5`} value={choice.body} onChange={(event) => {setChoice({...choice, body: event.target.value })}
                        }/>
                        <label className={labelTextClass}> Correct </label>
                        <input type="checkbox" className="bg-gray-light" value={String(choice.correct)} checked={choice.correct} onChange={(event) => {setChoice({...choice, correct: event.target.checked })}
                        } />
                    </div>
                    <div className="mb-1">
                        <label className={labelTextClass}> Explanation </label>
                    </div>
                    <div className="container flex flex-row">
                        <input className={`${textInputClass} w-full h-[100px]`} value={choice.explanation} onChange={(event) => {setChoice({...choice, explanation: event.target.value })}} type="text"/>
                        <button type="button" className={`${error ? actioButtonDisabledClass : actionButtonClass} ml-2`} onClick={handleSubmit}> save </button>
                    </div>
                </form>
            </div>
        )
};
