import { useState } from "react";
import { formBox, headingText, labelDivClass, labelText } from "./CommonStyling";
import { QuestionDetails } from "./QuestionDetails";

export const textInputClass = "border-2 border-black bg-white px-3 h-[2em]";

export const BankDetails = () =>
{
    const [ addingQuestion, setAddingQuestion ] = useState<boolean>(false);

    return (
        <>
        { addingQuestion
                ? <QuestionDetails/>
                :  <div className="container flex flex-col h-1/2 items-start px-3 w-[100em] justify-evenly">
                        <div className={formBox}>
                            <h3 className={headingText}> Tell us about your bank </h3>
                            <form className="py-2">
                                <div className="container flex flex-col">
                                    <div className={labelDivClass}>
                                        <label className={labelText}> Name </label><input className={`${textInputClass}, w-[30em]`} type={"text"}/>
                                    </div>
                                    <div className={labelDivClass}>
                                        <label className={labelText}> Visibility </label>
                                        <div>
                                            <label className={labelText}>Public </label><input type={"checkbox"}/>
                                        </div>
                                    </div>
                                        <div className={labelDivClass}>
                                            <label className={labelText}> Tags </label>
                                            <input className={textInputClass} type={"text"}/>
                                        </div>
                                    </div>
                                    <button className="my-2 rounded-sm w-1/5 bg-purple border-2 border-black text-lg text-gray-light" onClick={() => setAddingQuestion(true)}> Add a question </button>
                            </form>
                        </div>
                    </div>
        }
        </>
    )
}