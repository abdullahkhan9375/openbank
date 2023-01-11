import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

interface ITableProps
{
    data: any,
    columns: any,
}

export const TableStyling =
{
    table: "container mt-5 border-2",
    thead: "border-2",
    th: `bg-purple text-white font-bold text-lg py-1`,
    td:  "text-lg py-1",
}

export const Table = (aTableProps: ITableProps) =>
{
    const table = useReactTable({
        data: aTableProps.data,
        columns: aTableProps.columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className={TableStyling.table}>
            <thead className={TableStyling.thead}>
            {table.getHeaderGroups().map(headerGroup => (
                <tr className="" key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                    <th className={TableStyling.th} key={header.id}>
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
                        <td className={`${TableStyling.td} ${index % 2 === 0 ? "bg-white" : "bg-gray-light"}`} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                    </tr>
                ))}
            </tbody>
    </table>
    );
};
