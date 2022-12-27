import { useSelector } from "react-redux";
import { flexRowClass } from "../../common";
import { TBank } from "../../model";
import { BankCard } from "./BankCard";

export const BankCarousel = () =>
{
    const lBanks: TBank[] = useSelector((state: any) => state.bank);
    

    return (
    <div className={`${flexRowClass} mt-5`}>
        {lBanks.map((aBank: TBank) => <BankCard {...aBank}/>)}
    </div>)
};