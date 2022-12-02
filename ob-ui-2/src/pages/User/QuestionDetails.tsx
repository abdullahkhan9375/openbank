import { FormEvent, useEffect, useState } from "react";
import { labelDivClass, labelText } from "./CommonStyling";
import { ChoiceDetails, TChoice } from "./ChoiceDetails";
import { textInputClass } from "./BankDetails";

const lEmptyChoice: TChoice =
{
    id: 0,
    body: "",
    correct: false,
    explanation: "",
};

const actioButtonBase = "rounded-sm border-2 border-black text-lg "
const actionButtonClass = `${actioButtonBase}, bg-purple hover:border-gray-light text-gray-light `
const actioButtonDisabledClass = `${actioButtonBase} cursor-not-allowed bg-gray text-black hover:border-black `

export const QuestionDetails = () =>
{
    const [ choiceQty, setChoiceQty ] = useState<number>(1);
    const [ questionStatement, setQuestionStatement ] = useState<string>("");
    const [ choices, setChoices ] = useState<TChoice[]>([]);
    const [ selectedChoice, setSelectedChoice ] = useState<TChoice>(lEmptyChoice);
    const [ error, setError ] = useState<boolean>(true);

    const handleSelectedChoice = (index: number) =>
    {
        const lIndex = choices.findIndex((aChoice: TChoice) =>
        {
            return aChoice.id === index
            
        });

        if (lIndex === -1)
        {
            setSelectedChoice({ ...lEmptyChoice, id: index });
        } else
        {
            setSelectedChoice({...choices[lIndex]})
        }
    };

    useEffect(() =>
    {
        setError(false);
        if (choices.length === 0 || choiceQty !== choices.length)
        {
            setError(true);
        }
        if (choiceQty === choices.length) // If choices are there but one is empty.
        {
            for (const choice of choices)
            {
                if (choice.body === "")
                {
                    setError(true);
                    break
                }
            }
        }
        console.log("Choices: ", choices);
    }, [choices])

    console.log("Selected choice: ", selectedChoice);

    const handleSubmit = (event: FormEvent) =>
    {
        event.preventDefault();
        if (choiceQty === choices.length) // If choices are there but one is empty.
        {
            for (const choice of choices)
            {
                if (choice.body === "")
                {
                    setError(true);
                    return;
                }
            }
        }

        setError(false);

        const lQuestion =
        {
            statement: questionStatement,
            qty: choiceQty,
            choices: choices,
        };

        console.log(lQuestion);
    };

    const onChoiceSubmit = (aChoice: TChoice) =>
    {
        const lChoices: TChoice[] = choices;

        const choiceIndex: number = lChoices.findIndex((lChoice: TChoice) =>
        {
            return lChoice.id === aChoice.id
        });

        console.log("Index: ", choiceIndex);

        if (choiceIndex === -1)
        {
            setChoices([...choices, aChoice])
        } else {
            lChoices[choiceIndex] = aChoice;
            setChoices(lChoices) 
        }
        setSelectedChoice(aChoice);
    }

    return (
        <div className="container bg-gray flex flex-col w-[100em] items-start justify-evenly mx-5 h-3/6 py-[3em] px-[3em] shadow-lg">
            <form onSubmit={handleSubmit} action=""
                className="container flex flex-col h-full justify-around">
                <div>
                    <div className={"container flex flex-row px-2 py-1 items-center justify-between w-full"}>
                        <label className={labelText}> Question Statement </label>
                        <input type="text"
                            className={`${textInputClass}, w-[50em]`}
                            value={questionStatement}
                            onChange={(event) => setQuestionStatement(event.target.value)}
                        />
                    </div>
                    <div className="container flex flex-row px-2 items-center justify-between w-full">
                        <label className={labelText}> No. of Choices </label>
                        <input type="number" className={`${textInputClass}, w-[5em]`} value={choiceQty} onChange={(event) => setChoiceQty(Number(event.target.value))}/>
                    </div>
                </div>
                <div>
                    <div className="container flex flex-row mt-3 px-2">
                        <div className={`${textInputClass}container flex flex-col text-center pt-3 w-1/3 h-[197px] bg-white overflow-scroll`}>
                            {
                                Array(choiceQty).fill(0).map((_, index: number) =>
                                {
                                    return <a onClick={() => handleSelectedChoice(index)}> Choice #{index} </a>
                                })
                            }
                        </div>
                        <ChoiceDetails selectedChoice={selectedChoice} onSubmitQuestion={onChoiceSubmit}/>
                    </div>
                </div>
                <div className="container flex flex-row mx-auto items-center justify-around w-[20em]">
                        <button className="border-0 bg-gray text-lg hover:text-gray-light"> Cancel </button>
                        <button type="submit" className={`${error ? actioButtonDisabledClass : actionButtonClass}, w-[10em]`}> Submit </button>
                </div>
            </form>
        </div>
    )
}