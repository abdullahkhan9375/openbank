import { flexRender, getCoreRowModel, RowModel, useReactTable } from "@tanstack/react-table"

interface ITableProps
{
    data: any,
    columns: any,
}

export const Table = (aTableProps: ITableProps) =>
{
    const table = useReactTable({
        data: aTableProps.data,
        columns: aTableProps.columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className="container mt-5 border-2 w-[60em] bg-gray-light">
            <thead className="border-0">
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
    )
}