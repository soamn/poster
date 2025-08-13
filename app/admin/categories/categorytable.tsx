"use client";
import { motion } from "motion/react";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import EditableCell from "./EditableCell";
import { EditableSubCell } from "./EditableSubCell";
import { Subcategory } from "@/app/generated/prisma";
import AddSubCategory from "./AddSubCat";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNotification } from "@/app/components/notification";

type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};

const CategoryTable = ({ categories }: { categories: Category[] }) => {
  const [data, setData] = useState<Category[]>(categories);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const { showNotification } = useNotification();

  const toggleRow = (rowIndex: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: (props) => {
        const rowIndex = props.row.index;
        const isExpanded = expandedRows[rowIndex];

        return (
          <div className="flex  items-center justify-between  ">
            <EditableCell
              getValue={props.getValue}
              row={props.row}
              column={props.column}
              table={props.table}
            />
            <div
              className=" text-gray-500 w-10  cursor-pointer flex  justify-center"
              onClick={() => toggleRow(rowIndex)}
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: async (rowIndex: number, columnId: string, value: string) => {
        // Clone and update the data
        const updatedRow = { ...data[rowIndex], [columnId]: value };
        const newData = data.map((row, index) =>
          index === rowIndex ? updatedRow : row
        );

        // Update the state first
        setData(newData);

        // Now safely use the updated row
        const itemId = updatedRow.id;

        // Optional: Send to backend
        try {
          const response = await fetch(`/api/category`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: value,
              id: itemId,
            }),
          });
          const result = await response.json();
          showNotification(result.message, "success", 1000);
        } catch (error) {
          console.error("Failed to update category:", error);
        }
      },
    },
  });

  // console.log(data);
  return (
    <div className="p-6 w-full ">
      <div className="rounded-4xl p-2 bg-gradient-to-r from-cyan-100 to-amber-100 bg-oacity-60 border-gray-300 ">
        <div className="rounded-4xl bg-white/60 min-h-150   ">
          {/* Header */}
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              className="flex   border-b  border-gray-300 text-gray-800 font-semibold px-4 py-3"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => (
                <div className="w-full" key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Rows */}
          {table.getRowModel().rows.map((row) => {
            const isExpanded = expandedRows[row.index];
            const category = row.original;

            return (
              <React.Fragment key={row.id}>
                {/* Category row */}
                <div className="flex items-center px-4 py-3  ">
                  {row.getVisibleCells().map((cell) => (
                    <div className="w-full" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>

                {/* Subcategories */}
                {isExpanded && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{
                      scaleY: 1,
                    }}
                    className=" px-6 py-2  text-sm text-gray-700 "
                  >
                    <ul className="  space-y-1">
                      {category.subcategories.map((s, k) => (
                        <li key={k} className="ml-2">
                          <EditableSubCell
                            value={{
                              name: s.name as string,
                              id: s.id,
                              categoryId: s.categoryId,
                            }}
                            onChange={(newName) => {
                              setData((prev) =>
                                prev.map((cat, i) =>
                                  i === row.index
                                    ? {
                                        ...cat,
                                        subcategories: cat.subcategories.map(
                                          (sub, j) =>
                                            j === k
                                              ? { ...sub, name: newName }
                                              : sub
                                        ),
                                      }
                                    : cat
                                )
                              );
                            }}
                            onBlurUpdate={async ({ name, id }: Subcategory) => {
                              try {
                                const response = await fetch(
                                  `/api/subcategory`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      name: name,
                                      id: id,
                                    }),
                                  }
                                );
                                const result = await response.json();
                                showNotification(
                                  result.message,
                                  "success",
                                  1000
                                );
                              } catch (err) {
                                console.error("Subcategory update failed", err);
                              }
                            }}
                          />
                        </li>
                      ))}
                      <li className="flex w-full justify-center ">
                        <AddSubCategory categoryId={category.id} />
                      </li>
                    </ul>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
