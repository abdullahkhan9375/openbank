import { mainContainer } from "../../common/CommonStyling";
import
{
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { TQuestion } from "./QuestionDetails";
import { actioButtonBase, actionButtonClass } from "../../common/buttons/styles";
import { BankDetails } from "./BankDetails";

type TBank =
{
    bankName: string,
    isPublic: boolean,
    tags: string[],
    questions: TQuestion[],
    createdAt: string,
};

type TBankView =
{
    bankName: string, 
    isPublic: boolean,
    tags: string[],
    numQuestions: number,
    createdAt: string,
    editable: boolean,
}

export const ShowBanks = () =>
{

    const columnHelper = createColumnHelper<TBankView>();
    const columns = [
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
        cell: info => <p className="text-center"> {info.getValue() ? <div onClick={() =>console.log(info)}> Edit </div> : "Not Editable"} </p>
    }),
    ];

    const lData: TBankView[] =
    [
        {
            bankName: "bank 1",
            createdAt: "1234",
            isPublic: true,
            tags: ["d", "s"],
            numQuestions: 3,
            editable: true,
        },
        {
            bankName: "bank 2",
            createdAt: "123456",
            isPublic: false,
            tags: ["d", "s"],
            numQuestions: 10,
            editable: false,
        },
    ]

    const table = useReactTable({
        data: lData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
      })

    return (
        <div className={`${mainContainer}`}>
                <h1 className=""> Your Banks </h1>
                <div className="container flex flex-row justify-end mt-5 w-[60em]">
                    <button className={actionButtonClass}> Create a bank </button>
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
