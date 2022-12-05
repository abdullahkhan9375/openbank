import { mainContainer } from "../../common/CommonStyling";
import
{
    CellContext,
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { TQuestion } from "./QuestionDetails";
import { actioButtonBase, actionButtonClass } from "../../common/buttons/styles";
import { BankDetails, TBank } from "./BankDetails";
import { useSelector, useDispatch } from 'react-redux'
import { bankAdded } from "../../reducers/bank";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

type TBankView =
{
    bankId: string,
    bankName: string, 
    isPublic: boolean,
    tags: string[],
    numQuestions: number,
    createdAt: string,
    editable: boolean,
}

export const ShowBanks = () =>
{
    const banks: TBank[] = useSelector((state: any) => state.bank);
    const navigate = useNavigate();

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

    const handleBankEdit = (info: CellContext<TBankView, boolean>) =>
    {
        const bankId = info.row.original.bankId;
        navigate(`${bankId}`)
    }

    const handleCreateBank = () =>
    {
        navigate(`new`);
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
    columnHelper.accessor("editable",{
        header: () => "Edit",
        cell: info => <p className="text-center"> {info.renderValue() ? <div onClick={() => handleBankEdit(info)}> Edit </div> : "Not Editable"} </p>
    }),
    ], []);

    const data = useMemo(() => lBanksData, []);

    const table = useReactTable({
        data: data as TBankView[],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
      })

    return (
        <div className={`${mainContainer}`}>
                <h1 className="font-normal"> Your Banks </h1>
                <div className="container flex flex-row justify-end mt-5 w-[60em]">
                    <button className={`${actionButtonClass} font-bold`} onClick={handleCreateBank}> Create a bank </button>
                </div>
                <table className="container mt-5 border-2 w-[60em] bg-gray-light">
                    <thead className="border-2">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr className="" key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => (
                            <th className={`${index % 2 === 0 ? "bg-white" : "bg-gray-light"}`} key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                            {row.getVisibleCells().map((cell, index) => (
                                <td className={`${index % 2 === 0 ? "bg-white" : "bg-gray-light"}`} key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};
