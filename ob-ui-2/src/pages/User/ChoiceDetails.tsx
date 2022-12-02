import { FormEvent, useEffect, useState } from "react";
import { textInputClass } from "./BankDetails";
import { labelText } from "./CommonStyling";

export type TChoice =
{
    id: number;
    body: string;
    correct: boolean;
    explanation?: string;
};

interface IChoiceProps
{
    selectedChoice: TChoice;
    onSubmitQuestion: (aChoice: TChoice) => void;
}

export const ChoiceDetails = (aChoiceProps: IChoiceProps) =>
{
    const [ choice, setChoice ] = useState<TChoice>(aChoiceProps.selectedChoice);

    const handleSubmit = (event: FormEvent) =>
    {
        aChoiceProps.onSubmitQuestion(choice);
    };

    useEffect(() =>
    {
        setChoice(aChoiceProps.selectedChoice)
    }, [aChoiceProps]);

    return (
            <div className="w-full mx-3">
                <form onSubmit={handleSubmit} action="">
                    <div className="mb-1">
                        <label className={labelText}> Choice #{choice.id} </label>
                    </div>
                    <div className="mb-1">
                        <input type="text" className={`${textInputClass}, w-4/5`} value={choice.body} onChange={(event) => {setChoice({...choice, body: event.target.value })}
                        }/>
                        <label className={labelText}> Correct </label>
                        <input type="checkbox" checked={choice.correct} onChange={(event) => {setChoice({...choice, correct: Boolean(event.target.value) })}
                        } />
                    </div>
                    <div className="mb-1">
                        <label className={labelText}> Explanation </label>
                    </div>
                    <div className="container flex flex-row">
                        <input className={`${textInputClass}, w-full h-[100px]`} value={choice.explanation} onChange={(event) => {setChoice({...choice, explanation: event.target.value })}} type="text"/>
                        <button type="button" onClick={handleSubmit}> save </button>
                    </div>
                </form>
            </div>
        )
};
