
import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  RowData,
  createColumnHelper,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { TableStyling } from '../../common/Table';
import { TChoice } from '../../model';

interface IChoiceTableProps
{
    choices: TChoice[],
    onSaveChoices: (aChoices: TChoice[]) => void;
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const defaultColumn: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value)
    }

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    if (id === "correct")
    {
        return (
            <div className='flex flex-row justify-center'>
                <input type="checkbox"
                className={"mx-auto"}
                value={String(value)}
                checked={Boolean(value)}
                onChange={(event) => {setValue(Boolean(event.target.checked))}}
                onBlur={onBlur}
                />
            </div>
        );
    }

    if (id === "id")
    {
        return (
            <input
              value={value as string}
              readOnly
              className={`text-wrapping px-3 bg-transparent w-10`}
              onChange={e => setValue(e.target.value)}
              onBlur={onBlur}
            />
          );
    }

    return (
      <input
        value={value as string}
        placeholder={`${id === "body" ? "write a statement here." : "write an explanation"}`}
        className={`text-wrapping px-3 ${id === "body" ? "w-[30em]" : "w-[20em]"}`}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
}

export const ChoiceTable = (aChoiceProps: IChoiceTableProps) =>
{
    const lChoices = aChoiceProps.choices;

    const columnHelper = createColumnHelper<any>();
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            columnHelper.accessor('id',
            {
                header: () => "#",
            }),
            columnHelper.accessor('body',
            {
                header: () => "Statement",
            }),
            columnHelper.accessor('explanation',
            {
                header: () => "Explanation (optional)",
            }),
            columnHelper.accessor('correct',
            {
                header: () => "Correct",
            }),
        ],
    []
  )

  const [data, setData] = useState<TChoice[]>(lChoices)

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
        updateData: (rowIndex, columnId, value) => {
          setData(old =>
            old.map((row, index) => {
              if (index === rowIndex) {
                return {
                  ...old[rowIndex]!,
                  [columnId]: value,
                }
              }
              return row
            })
          )
        },
      },
    debugTable: true,
  })

  useEffect(() =>
  {
    console.log(data);
    aChoiceProps.onSaveChoices(data);
  }, data)

  return (
      <table className={TableStyling.table}>
        <thead className={`${TableStyling.thead} text-left` }>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th className={`${TableStyling.th} px-3`} key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} className="">
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <td
                      className={`text-md`}
                      key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
  );
};
