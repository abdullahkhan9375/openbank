import { mainContainer } from "../../common/CommonStyling";
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
import { actioButtonBase, actionButtonClass } from "../../common/buttons/styles";
import { BankDetails } from "./BankDetails";
import { useSelector, useDispatch } from 'react-redux'
import { bankAdded, bankDeleted } from "../../reducers/bank";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Table } from "../../common/Table";
import { TBank, TBankView } from "../../model";

export const ShowBanks = () =>
{
    const banks: TBank[] = useSelector((state: any) => state.bank);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lBanksData = banks.map((aBank: TBank) =>
    {
        return (
            {
                bankId: aBank.bankId,
                bankName: aBank.bankName,
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
        const bankId = info.row.original.bankId;
        navigate(`${bankId}`)
    }

    const handleCreateBank = () =>
    {
        navigate(`new`);
    }

    const handleDeleteBank = (info: CellContext<TBankView, string>) =>
    {
        dispatch(bankDeleted(info.row.original.bankId));
    }

    const columnHelper = createColumnHelper<TBankView>();
    const columns = useMemo (() =>[
    columnHelper.accessor('bankName',
    {
        header: () => "Bank Name",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor('createdAt',
    {
        header: () => "Created At",
        cell: info => <p className="text-center"> {info.getValue()} </p>,
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
    columnHelper.accessor("bankId",{
        header: () => "",
        cell: info => <div className="container flex flex-col mx-auto"> {info.renderValue()
            ? <div className="container flex flex-row justify-around">
            <BsFillPencilFill className="cursor-pointer" onClick={() => handleBankEdit(info)}/>
            <BsFillTrashFill className="cursor-pointer" onClick={() => handleDeleteBank(info)}/>
            </div>
            :  "Not Editable"} </div>
    }),
    ], [banks]);

    const data = useMemo(() => lBanksData, [banks]);

    return (
        <div className={`${mainContainer}`}>
                <h1 className="font-normal"> Your Banks </h1>
                <div className="container flex flex-row justify-end mt-5 w-[60em]">
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
