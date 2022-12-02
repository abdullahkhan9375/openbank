import { FormEvent, useState } from "react";
import { labelDivClass } from "./CommonStyling";
import { ChoiceDetails, TChoice } from "./ChoiceDetails";

const lEmptyChoice: TChoice =
{
    id: 0,
    body: "",
    correct: false,
};

export const QuestionDetails = () =>
{
    const [ choiceQty, setChoiceQty ] = useState<number>(1);
    const [ questionStatement, setQuestionStatement ] = useState<string>("");
    const [ choices, setChoices ] = useState<TChoice[]>([]);
    const [ selectedChoice, setSelectedChoice ] = useState<TChoice>(lEmptyChoice);

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

    console.log("Selected choice: ", selectedChoice);

    const handleSubmit = (event: FormEvent) =>
    {
        console.log(event);
        event.preventDefault();
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
    }

    return (
        <div className="bg-pink h-3/6 w-5/6 py-10 px-10 shadow-lg">
            <form onSubmit={handleSubmit} action=""
                className="container flex flex-col h-full justify-between">
                <div>
                    <div className={"container flex flex-row px-2 py-1 items-center justify-between w-full"}>
                        <label> Question Statement </label>
                        <input type="text"
                            className="w-3/4"
                            value={questionStatement}
                            onChange={(event) => setQuestionStatement(event.target.value)}
                        />
                    </div>
                    <div className="container flex flex-row px-2 items-center justify-between w-full">
                        <label> No. of Choices </label>
                        <input type="number" className="self-center w-1/6" value={choiceQty} onChange={(event) => setChoiceQty(Number(event.target.value))}/>
                    </div>
                </div>
                <div>
                    <div className="container flex flex-row mt-3 px-2">
                        <div className="container flex flex-col text-center pt-3 w-1/3 h-[185px] bg-white overflow-scroll">
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
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}