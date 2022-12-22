import { actionButtonClass, flexColClass, labelDivClass, labelTextClass, textInputClass } from "../../common"

export const LoginDetails = () =>
{
    return (
        <div className="mt-[5em] mb-20">
            <div className={`${flexColClass} w-[100%] ml-6 mt-5`}>
                <div className={`${labelDivClass} my-[1em]`}>
                    <label className={labelTextClass}> Username / Email </label>
                    <div>
                       <input type="text" className={`${textInputClass} w-[15em]`}/>
                    </div>
                </div>
                <div className={`${labelDivClass} my-[1em]`}>
                    <label className={labelTextClass}> Password </label>
                    <div>
                        <input type="text" className={`${textInputClass} w-[15em]`}/>
                    </div>
                </div>
            </div>
            <div className="self-start mt-9 ml-6">
                <button className={`${actionButtonClass} w-[12em] font-bold text-lg`}> Login </button> 
            </div>
        </div>
    )
}
