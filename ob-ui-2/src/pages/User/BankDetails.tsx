import { useState } from "react";
import { formBox, headingText, labelDivClass, labelText } from "./CommonStyling";
import { QuestionDetails } from "./QuestionDetails";

export const BankDetails = () =>
{
    const [ addingQuestion, setAddingQuestion ] = useState<boolean>(false);

    return (
        <div className="container flex flex-col h-full items-start px-3 justify-evenly">
            { addingQuestion
                ? <QuestionDetails/>
                
                :  <><div className={formBox}>
                <h3 className={headingText}> Tell us about your bank </h3>
                <form className="py-2">
                    <div className="container flex flex-col">
                        <div className={labelDivClass}>
                            <label className={labelText}> Name </label><input className="w-2/3" type={"text"}/>
                        </div>
                        <div className={labelDivClass}>
                            <label className={labelText}> Visibility </label>
                            <div>
                                <label className={labelText}>Public </label><input type={"checkbox"}/>
                            </div>
                        </div>
                    <div className={labelDivClass}>
                        <label className={labelText}> Tags </label>
                        <input className="w-2/3" type={"text"}/>
                    </div>
                </div>
                </form>
                   </div>
                    <div className={formBox}>
                        <h3 className={headingText}> Add your questions. </h3>
                        <button className="my-3 w-1/2" onClick={() => setAddingQuestion(true)}> Add a question </button>
                    </div>
                    </>
        }
        </div>
    )
}