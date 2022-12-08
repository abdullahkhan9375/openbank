import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { actionButtonClass } from "../../common/buttons/styles";
import { mainContainer } from "../../common/CommonStyling";
import { useSelector, useDispatch } from 'react-redux';
import { createColumnHelper } from "@tanstack/react-table";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { Table } from "../../common/Table";
import { TTest, TTestView } from "../../model";
// TODO: publish/subscribe system.

export const ShowTests = () =>
{
    const tests: TTest[] = useSelector((state: any) => state.test);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lTestsData: TTestView[] = tests.map((aTest: TTest) =>
    {
        return (
        {
            id: aTest.id,
            name: aTest.name,
            isPublic: aTest.isPublic,
            createdAt: aTest.createdAt,
            description: aTest.description,
            tags: aTest.tags,
            timeLimit: aTest.timeLimit,
            numQuestions: aTest.questions.length,
            passingScore: aTest.passingScore,
        }
        )
    });

    const columnHelper = createColumnHelper<TTestView>();
    const columns = useMemo (() =>[
    columnHelper.accessor('name',
    {
        header: () => "Test Name",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor('createdAt',
    {
        header: () => "Created At",
    }),
    columnHelper.accessor('description', {
        header:() => "Description",
        cell: info => <p className="text-center"> {info.getValue() ? "Public" :"Private"} </p>,
    }),
    columnHelper.accessor('tags', {
        header: () => "Tags",
        cell: info => <p> {`${info.getValue()}`} </p>,
    }),
    columnHelper.accessor('isPublic', {
        header: () => "Visibility",
        cell: info => <p> {`${info.getValue() ? "Public" : "Private"}`} </p>,
    }),
    columnHelper.accessor('timeLimit', {
        header: () => "Time Limit",
        cell: info => <p> {`${info.getValue()}`} </p>,
    }),
    columnHelper.accessor('numQuestions', {
        header: () => "Total Questions",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor('passingScore', {
        header: () => "Passing Score",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor("id",{
        header: () => "",
        cell: info => <div className="container flex flex-col mx-auto"> {info.renderValue()
            ? <div className="container flex flex-row justify-around">
            <BsFillPencilFill className="cursor-pointer" onClick={() => {}}/>
            <BsFillTrashFill className="cursor-pointer" onClick={() => {}}/>
            </div>
            :  "Not Editable"} </div>
    }),
    ], [tests]);

    const data = useMemo(() => lTestsData, [tests]);
    
    return (
        <div className={mainContainer}>
            <h1 className="font-normal"> Your Tests </h1>
                <div className="container flex flex-row justify-end mt-5 w-[60em]">
                    <button className={`${actionButtonClass} font-bold`} onClick={() => navigate("new")}> Create a test </button>
                </div>
                <Table data={data} columns={columns}/>
        </div>
    )
}
