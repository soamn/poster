"use client";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNotification } from "@/components/notification";

const EditableCell = ({ getValue, row, column, table }: any) => {
  const initalValue = getValue();
  const [value, setValue] = useState(initalValue);
  const [showsave, setShowsave] = useState(false);
  const { showNotification } = useNotification();

  const onblur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };
  useEffect(() => {
    setValue(initalValue);
  }, [initalValue]);

  const deltecategory = async () => {
    try {
      const response = await fetch(`/api/category`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: row.original.id }),
      });
      const result = await response.json();
      if (!result.success) {
        showNotification(result.message, "error", 1500);
      } else {
        showNotification(result.message, "error", 1500);
      }
    } catch (error) {}
  };
  return (
    <div className="flex  w-full justify-between">
      <input
        className="px-1 outline-0"
        value={value}
        onChange={(e) => {
          setShowsave(true);
          setValue(e.target.value);
        }}
      />
      <div className="">
        {showsave ? (
          <button
            onClick={onblur}
            className="px-1 rounded bg-lime-500 cursor-pointer"
          >
            Save
          </button>
        ) : (
          ""
        )}
        <button
          onClick={deltecategory}
          className=" px-1 rounded cursor-pointer"
        >
          <Trash width={20} />
        </button>
      </div>
    </div>
  );
};

export default EditableCell;
