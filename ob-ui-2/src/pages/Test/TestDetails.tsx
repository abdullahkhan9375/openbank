import { useState } from "react"
import { formBox, headingText, labelDivClass, labelText, mainContainer, textInputClass } from "../../common/CommonStyling"
import { TTest } from "../../model"
import TagsInput from "react-tagsinput";
import { QuestionSubscription } from "./QuestionSubscription";

const lEmptyTest: TTest =
{
    id:"",
    name: "",
    isPublic: false,
    createdAt: "",
    description: "",
    tags: [],
    questions: [],
    timeLimit: 0,
    passingScore: 10,
}
export const TestDetails = () =>
{
    const [test, setTest] = useState<TTest>(lEmptyTest);

    return (
        <div className={mainContainer}>
            <div className="container flex flex-col w-[60em]">
            <div className={formBox}>
                <h3 className={headingText}> Tell us about your test </h3>
                <form className="py-2">
                    <div className="container flex flex-col">
                        <div className={labelDivClass}>
                            <label
                                className={labelText}>
                                    Name
                            </label>
                            <input
                                value={test.name}
                                onChange={(event) => { setTest({ ...test, name: event.target.value })}}
                                className={`${textInputClass} w-[30em]`} type={"text"}
                            />
                        </div>
                        <div className={labelDivClass}>
                            <label
                                className={labelText}>
                                    Description
                            </label>
                            <input
                                value={test.description}
                                onChange={(event) => { setTest({ ...test, description: event.target.value })}}
                                className={`${textInputClass} w-[40em] h-[4em]`} type={"text"}
                            />
                        </div>
                        <div className={labelDivClass}>
                            <label className={labelText}> Visibility </label>
                            <div>
                                <label className={labelText}>
                                    Public
                                </label>
                                <input
                                        checked={test.isPublic}
                                        onChange={(event) => setTest({ ...test, isPublic: event.target.checked })}
                                        className="bg-gray-light border-0 mx-2" type={"checkbox"}
                                />
                            </div>
                        </div>
                        <div className={labelDivClass}>
                            <label
                                className={labelText}>
                                    Passing Score
                            </label>
                            <input
                                value={test.passingScore}
                                onChange={(event) => { setTest({ ...test, passingScore: Number(event.target.value)})}}
                                className={`${textInputClass} w-[5.5em]`} type={"number"}
                            />
                        </div>
                        <div className={labelDivClass}>
                            <label
                                className={labelText}>
                                    Time Limit
                            </label>
                            <input
                                value={test.passingScore}
                                onChange={(event) => { setTest({ ...test, timeLimit: Number(event.target.value)})}}
                                className={`${textInputClass} w-[5.5em]`} type={"number"}
                            />
                        </div>
                            <div className={labelDivClass}>
                                <label className={labelText}> Tags </label>
                                <TagsInput value={test.tags} onChange={(tags: string[]) => setTest({...test, tags: tags })} />
                            </div>
                        </div>
                        <QuestionSubscription/>
                    </form>
                </div>
            </div>
        </div>
    )
}