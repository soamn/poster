"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Category, Post, Subcategory, User } from "../app/generated/prisma";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDownIcon,
  ChevronUp,
} from "lucide-react";

const BasicTable = ({ data, columns }: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Show 1 row per page
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      globalFilter: filtering,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="overflow-x-auto ">
      <input
        className=" p-1 lg:px-5 m-2 text-xs  rounded-full focus:outline-gray-700 outline outline-gray-400 placeholder:text-xs"
        placeholder="Search"
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
      />

      <table className="w-full">
        <thead className=" border-b-1 border-zinc-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort();
                const sorted = header.column.getIsSorted();

                return (
                  <th
                    key={header.id}
                    className="px-1 text-xs py-3  cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="flex ">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {isSortable && (
                        <span className="ml-1">
                          {sorted === "asc" ? (
                            <ChevronUp className="inline " width={15} />
                          ) : sorted === "desc" ? (
                            <ChevronDown className="inline " width={15} />
                          ) : (
                            <ChevronsUpDownIcon
                              className="inline "
                              width={15}
                            />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="*:border-b-1 *:border-zinc-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100 cursor-pointer ">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-5 text-xs ">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-5  *:px-2 *:hover:outline *:cursor-pointer *:rounded *:ml-2 *:disabled:opacity-30">
        <button onClick={() => table.setPageIndex(0)}>
          <ChevronFirst />
        </button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <ChevronLeft />
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ChevronRight />
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
          <ChevronLast />
        </button>
      </div>
    </div>
  );
};

export default BasicTable;
