"use client";

import React, { useState } from "react";
import { Subcategory } from "@/app/generated/prisma";
import { Trash } from "lucide-react";
import { useNotification } from "@/app/components/notification";

type EditableSubCellProps = {
  value: Subcategory;
  onChange: (newValue: string) => void;
  onBlurUpdate?: (s: Subcategory) => void;
};

export const EditableSubCell = ({
  value,
  onChange,
  onBlurUpdate,
}: EditableSubCellProps) => {
  const [name, setName] = useState(value.name);
  const [id, setId] = useState(value.id);
  const [showsave, setShowsave] = useState(false);
  const { showNotification } = useNotification();

  const deletesubcategory = async () => {
    try {
      const response = await fetch(`/api/subcategory`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
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
    <div className="flex justify-between">
      <input
        className="  py-1 w-fit outline-0"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onChange(e.target.value);
          setShowsave(true);
        }}
      />
      <div>
        {showsave ? (
          <button
            onClick={() => {
              setShowsave(false);
              if (onBlurUpdate) {
                onBlurUpdate({
                  name: name,
                  id: id,
                  categoryId: value.categoryId,
                });
              }
            }}
            className="px-1 rounded bg-lime-500 cursor-pointer"
          >
            Save
          </button>
        ) : (
          ""
        )}
        <button onClick={deletesubcategory} className=" px-2 cursor-pointer">
          <Trash width={20} />
        </button>
      </div>
    </div>
  );
};
