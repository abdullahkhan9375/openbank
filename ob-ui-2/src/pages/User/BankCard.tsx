import { actionButtonClass, flexColClass, flexRowClass } from "../../common";
import { TBank } from "../../model";

export const BankCard = (aBank: TBank) =>
{
    return (
        <div className={`${flexRowClass} p-3 justify-between
             rounded-sm shadow-sm border-2 w-[23em] h-[15em] mr-2`}>
            <div className="mt-3 mr-2">
                <p>
                    {aBank.name}
                </p>
                <p className="text-gray">
                    Y'all it's a cool bank with lots of questions.
                </p>
            </div>
            <div className={`${flexColClass} justify-around w-[40%]`}>
                <div className={`${flexRowClass}`}>
                    {aBank.tags.map((aTag: string) =>
                        <div className="font-light px-1">
                            {aTag}
                        </div>)}
                </div>
                <div className="text-black text-right">
                    {aBank.questions.length} Questions
                </div>
                <div className="text-black text-right">
                    60K subscribers
                </div>
                <button className={`self-end text-sm font-semibold ${actionButtonClass} h-[3em] w-[8em]`}> Subscribe </button>
            </div>
        </div>
    );
};
