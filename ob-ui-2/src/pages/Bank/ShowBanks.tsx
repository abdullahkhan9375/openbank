import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import
{
    CellContext,
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { actionButtonClass, flexColClass, flexRowClass, mainContainerClass } from "../../common";
import { BankDetails } from "./BankDetails";
import { useSelector, useDispatch } from 'react-redux'
import { bankAdded, bankDeleted } from "../../reducers/bank";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Table } from "../../common/Table";
import { TBank, TBankView } from "../../model";
import moment from "moment";

export const ShowBanks = () =>
{
    const banks: TBank[] = useSelector((state: any) => state.bank);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lBanksData: TBankView[] = banks.map((aBank: TBank) =>
    {
        return (
            {
                id: aBank.id,
                name: aBank.name,
                isPublic: aBank.isPublic,
                tags: aBank.tags,
                numQuestions: aBank.questions.length,
                createdAt: aBank.createdAt,
                editable: true,
            }
        )
    });

    const handleBankEdit = (info: CellContext<TBankView, string>) =>
    {
        const id = info.row.original.id;
        navigate(`${id}`)
    }

    const handleCreateBank = () =>
    {
        navigate(`new`);
    }

    const handleDeleteBank = (info: CellContext<TBankView, string>) =>
    {
        dispatch(bankDeleted(info.row.original.id));
    }

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
        cell: info => <p className="text-center"> {moment.unix(info.getValue()).format("DD/MM/YYYY")}</p>
    }),
    columnHelper.accessor('isPublic', {
        header:() => "Visibility",
        cell: info => <p className="text-center"> {info.getValue() ? "Public" :"Private"} </p>,
    }),
    columnHelper.accessor('tags', {
        header: () => "Tags",
        cell: info => <p> {`${info.getValue()}`} </p>,
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
        <div className={`${mainContainerClass}`}>
                <h1 className="font-bold mt-4"> Your Banks </h1>
                <div className={`${flexRowClass} justify-end mt-5`}>
                    <button className={`${actionButtonClass} font-bold`} onClick={handleCreateBank}> Create a bank </button>
                </div>
                {
                    banks.length > 0
                    ? <Table data={data} columns={columns}/>
                    : <div className="mt-10 text-center">
                        <h2 className="font-normal text-4xl text-gray">You aren't subscribed to any banks yet.</h2>
                        </div>
                }
        </div>
    );
};
