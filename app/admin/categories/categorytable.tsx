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
import { Category, Subcategory } from "@/app/generated/prisma";
import AddSubCategory from "./AddSubCat";
import { ChevronDown, ChevronUp, PlusCircleIcon, Trash2 } from "lucide-react";
import { useNotification } from "@/components/notification";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";

type CategoryWithData = Category & {
  subcategories: Subcategory[];
};

const CategoryTable = ({ categories }: { categories: CategoryWithData[] }) => {
  const [data, setData] = useState<CategoryWithData[]>(categories);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [sitesState, setSitesState] = useState<Record<number, JsonValue[]>>(
    () =>
      categories.reduce((acc, cat) => {
        acc[cat.id] = Array.isArray(cat.sites) ? [...cat.sites] : [];
        return acc;
      }, {} as Record<number, JsonValue[]>)
  );

  const [siteInputs, setSiteInputs] = useState<Record<number, string>>({});

  const { showNotification } = useNotification();

  const toggleRow = (rowIndex: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const updateSites = async (categoryId: number, newSites: JsonValue[]) => {
    try {
      const response = await fetch(`/api/category/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryId, sites: newSites }),
      });
      const result = await response.json();

      showNotification(
        result.message,
        result.success ? "success" : "error",
        1000
      );
    } catch (err) {
      showNotification("Failed to update sites", "error", 1000);
    }
  };

  const handleAddSite = (catId: number) => {
    const newSite = siteInputs[catId]?.trim();
    if (!newSite) return;

    const newSites = [...(sitesState[catId] || []), newSite];
    setSitesState((prev) => ({ ...prev, [catId]: newSites }));
    setSiteInputs((prev) => ({ ...prev, [catId]: "" }));
    updateSites(catId, newSites);
  };

  const handleRemoveSite = (catId: number, index: number) => {
    const newSites = sitesState[catId].filter((_, i) => i !== index);
    setSitesState((prev) => ({ ...prev, [catId]: newSites }));
    updateSites(catId, newSites);
  };

  const columns: ColumnDef<CategoryWithData>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: (props) => {
        const rowIndex = props.row.index;
        const isExpanded = expandedRows[rowIndex];

        return (
          <div className="flex items-center justify-between">
            <EditableCell
              getValue={props.getValue as () => string}
              row={props.row}
              column={props.column}
              table={props.table}
            />
            <div
              className="text-gray-500 w-10 cursor-pointer flex justify-center"
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
        const updatedRow = { ...data[rowIndex], [columnId]: value };
        const newData = data.map((row, index) =>
          index === rowIndex ? updatedRow : row
        );
        setData(newData);

        try {
          const response = await fetch(`/api/category`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: value, id: updatedRow.id }),
          });
          const result = await response.json();
          showNotification(
            result.message,
            result.success ? "success" : "error",
            1000
          );
        } catch (error) {
          console.error("Failed to update category:", error);
        }
      },
    },
  });

  return (
    <div className="p-6 w-full">
      <div className="rounded-4xl p-2 bg-gradient-to-r from-cyan-100 to-amber-100 border-gray-300">
        <div className="rounded-4xl bg-white/60 min-h-150">
          {/* Header */}
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              className="flex border-b border-gray-300 text-gray-800 font-semibold px-4 py-3"
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
                <div className="flex items-center px-4 py-3">
                  {row.getVisibleCells().map((cell) => (
                    <div className="w-full" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="px-6 py-2 text-sm text-gray-700"
                  >
                    {/* Sites */}
                    <div className="py-1">
                      <label className="text-sm font-medium">Sites</label>
                      {sitesState[category.id]?.length > 0 && (
                        <ul className="flex flex-wrap gap-2 mt-2">
                          {sitesState[category.id].map((s, i) => (
                            <li
                              key={i}
                              className="flex items-center bg-gray-100 px-2 text-xs py-1 rounded"
                            >
                              {s?.toString()}
                              <button
                                type="button"
                                onClick={() => handleRemoveSite(category.id, i)}
                                className="ml-2"
                              >
                                <Trash2 size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex gap-2 mt-1">
                        <input
                          value={siteInputs[category.id] || ""}
                          onChange={(e) =>
                            setSiteInputs((prev) => ({
                              ...prev,
                              [category.id]: e.target.value,
                            }))
                          }
                          type="text"
                          className="p-2 w-1/6 outline-none"
                          placeholder="Enter site (e.g. site.com)"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSite(category.id)}
                          className="cursor-pointer"
                        >
                          <PlusCircleIcon size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <b>Subcategories</b>
                    <ul className="space-y-1">
                      {category.subcategories.map((s, k) => (
                        <li key={k} className="ml-2">
                          <EditableSubCell
                            value={{
                              name: s.name ?? "",
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
                                    body: JSON.stringify({ name, id }),
                                  }
                                );
                                const result = await response.json();
                                showNotification(
                                  result.message,
                                  "success",
                                  1000
                                );
                              } catch (err) {}
                            }}
                          />
                        </li>
                      ))}
                      <li className="flex w-full justify-center">
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
