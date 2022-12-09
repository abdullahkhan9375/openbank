import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { actionButtonClass } from "../../common/buttons/styles";
import { mainContainer } from "../../common/CommonStyling";
import { useSelector, useDispatch } from 'react-redux';
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { Table } from "../../common/Table";
import { TQuestion, TTest, TTestView } from "../../model";
import { testDeleted } from "../../reducers/test";
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
            numQuestions: aTest.subscribedQuestions.length,
            passingScore: aTest.passingScore,
        }
        );
    });

    const handleEditTest = (info: CellContext<TTestView, string>) =>
    {
        const testId = info.row.original.id;
        navigate(`${testId}`);
    };

    const handleDeleteTest = (info: CellContext<TTestView, string>) =>
    {
        dispatch(testDeleted(info.row.original.id));
    };

    const handleCreateTest = () =>
    {
        navigate("new");
    };

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
        header: () => "Questions",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor('passingScore', {
        header: () => "Passing Score",
        cell: info => <p className="text-center"> {info.getValue()} </p>
    }),
    columnHelper.accessor("name",{
        header: () => "",
        cell: info => <div className="container flex flex-col mx-auto"> {info.renderValue()
            ? <div className="container flex flex-row justify-around">
            <BsFillPencilFill className="cursor-pointer" onClick={() => handleEditTest(info)}/>
            <BsFillTrashFill className="cursor-pointer" onClick={() => handleDeleteTest(info)}/>
            </div>
            :  "Not Editable"} </div>
    }),
    ], [tests]);

    const data = useMemo(() => lTestsData, [tests]);

    return (
        <div className={mainContainer}>
            <h1 className="font-normal"> Your Tests </h1>
                <div className="container flex flex-row justify-end mt-5 w-[60em]">
                    <button className={`${actionButtonClass} font-bold`} onClick={handleCreateTest}> Create a test </button>
                </div>
                {tests.length > 0
                    ? <Table data={data} columns={columns}/>
                    : <div className="mt-10">
                        <h2 className="font-normal text-4xl text-gray">You are not subscribed to any tests currently.</h2>
                      </div>}
        </div>
    )
};
