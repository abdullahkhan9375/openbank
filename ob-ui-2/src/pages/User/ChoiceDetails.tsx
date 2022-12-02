import { FormEvent, useEffect, useState } from "react";

export type TChoice =
{
    id: number;
    body: string;
    correct: boolean;
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
                        <label> Choice #{choice.id} </label>
                    </div>
                    <div className="mb-1">
                        <input type="text" className="w-4/5" value={choice.body} onChange={(event) => {setChoice({...choice, body: event.target.value })}
                        }/>
                        <label> Correct </label>
                        <input type="checkbox" checked={choice.correct} onChange={(event) => {setChoice({...choice, correct: Boolean(event.target.value) })}
                        } />
                    </div>
                    <div className="mb-1">
                        <label> Explanation </label>
                    </div>
                    <div>
                        <input className="w-full h-[100px]" type="text"/>
                    </div>
                    <button type="button" onClick={handleSubmit}> save </button>
                </form>
            </div>
        )
};