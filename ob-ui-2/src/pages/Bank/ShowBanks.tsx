import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { actionButtonClass, flexColClass, flexRowClass, mainContainerClass } from "../../common";
import { useSelector, useDispatch } from 'react-redux'
import { deleteBankForUser, getBanksForUser } from "../../reducers/bank";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Table } from "../../common/Table";
import { TBank, TBankView } from "../../model";
import moment from "moment";
import { NavPanel } from "../Components/NavPanel";
import { useEffect } from "react";
import { Cache } from "aws-amplify";
import { TGlobalState } from "../../reducers/global";
import { AppDispatch } from "../../store";
import { SyncLoader } from "react-spinners";

export const ShowBanks = () =>
{
    const [ page, setPage ] = useState<number>(1);
    const [ loading, setLoading ] = useState<boolean>(false);

    const banks: TBank[] = useSelector((state: any) => state.bank);
    const global: TGlobalState = useSelector((state: any) => state.global);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const lApiCalled = Cache.getItem("getBanksCalled") ?? false;

    const lBanksData: TBankView[] = banks.map((aBank: TBank) =>
    {
        return (
            {
                id: aBank.id,
                name: aBank.name,
                type: "bank",
                isPublic: aBank.isPublic,
                lastUpdated: aBank.lastUpdated,
                tags: aBank.tags,
                numQuestions: aBank.questions.length,
                createdAt: aBank.createdAt,
                editable: true,
            }
        )
    });

    useEffect(() =>
    {
        if (!lApiCalled)
        {
            console.log("Api call made for getBanks");
            Cache.setItem("getBanksCalled", true);
            setLoading(true);
            (async() => (await dispatch(getBanksForUser({ userId: global.user.userId, page }))))();
            setLoading(false);
        }
    }, []);

    const handleBankEdit = (info: CellContext<TBankView, string>) =>
    {
        const id = info.row.original.id;
        navigate(`${id}`)
    }

    const handleCreateBank = () =>
    {
        navigate(`new`);
    };

    const handleDeleteBank = (info: CellContext<TBankView, string>) =>
    {
        dispatch(deleteBankForUser({ userId: Cache.getItem("userId"), bankId: info.row.original.id }));
    };

    const columnHelper = createColumnHelper<TBankView>();
    const columns = useMemo (() =>[
    columnHelper.accessor('name',
    {
        header: () => "Bank Name",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor('createdAt',
    {
        header: () => "Created At",
        cell: info => <p className="text-center"> {moment(info.getValue()).format("DD/MM/YYYY")}</p>
    }),
    columnHelper.accessor('isPublic', {
        header:() => "Visibility",
        cell: info => <p className="text-center"> {info.getValue() ? "Public" :"Private"} </p>,
    }),
    columnHelper.accessor('tags', {
        header: () => "Tags",
        cell: info => <p className="text-center"> {`${info.getValue()}`} </p>,
    }),
    columnHelper.accessor('numQuestions', {
        header: () => "Total Questions",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor("id",{
        header: () => "",
        cell: info => <div className={`${flexColClass} mx-auto`}> {info.renderValue()
            ? <div className={`${flexRowClass} justify-around`}>
            <BsFillPencilFill className="cursor-pointer" onClick={() => handleBankEdit(info)}/>
            <BsFillTrashFill className="cursor-pointer" onClick={() => handleDeleteBank(info)}/>
            </div>
            :  "Not Editable"} </div>
    }),
    ], [banks]);

    const data = useMemo(() => lBanksData, [banks]);

    return (
        <>
            <NavPanel/>
            <div className={`${mainContainerClass}`}>
                    <h1 className="font-bold mt-4"> Your Banks </h1>
                    <div className={`${flexRowClass} justify-end mt-5`}>
                        <button className={`${actionButtonClass} font-bold`} onClick={handleCreateBank}> Create a bank </button>
                    </div>
                    { loading
                    ? <SyncLoader className="mt-[1.6em]" size={18}/>
                    : <>
                        {
                            banks.length > 0
                            ? <Table data={data} columns={columns}/>
                            : <div className="mt-10 text-center">
                                <h2 className="font-normal text-4xl text-gray">You aren't subscribed to any banks yet.</h2>
                                </div>
                        }
                        </>
                    }
            </div>
        </>
    );
};
