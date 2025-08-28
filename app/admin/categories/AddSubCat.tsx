"use client";
import { Delete, X } from "lucide-react";
import React, { useState } from "react";
import { useNotification } from "@/components/notification";
type Props = {
  categoryId: number;
};

const AddSubCategory = ({ categoryId }: Props) => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [subcategoryName, setSubCategoryName] = useState("");
  const { showNotification } = useNotification();
  const [adding, setAdding] = useState(false);
  const addsubcategory = async () => {
    if (subcategoryName == "") {
      return;
    }
    try {
      setAdding(true);
      const res = await fetch("/api/subcategory", {
        method: "POST",
        headers: {
          "Content-Type": "appication/json",
        },
        body: JSON.stringify({ name: subcategoryName, categoryId: categoryId }),
      });
      const response = await res.json();
      if (response.status == 200) {
        setisOpen(false);
      }
      showNotification(response.message, "success", 1000);
    } catch (error) {
    } finally {
      setAdding(false);
    }
  };
  return (
    <>
      <button
        hidden={isOpen}
        onClick={() => setisOpen(true)}
        className="bg-zinc-300 ring  cursor-pointer active:scale-98 ring-zinc-400 text-white rounded px-2"
      >
        +
      </button>
      {isOpen ? (
        <div className="flex flex-col gap-1  ">
          <div className="flex w-full justify-between">
            <label htmlFor="subcategoryname"> Enter sub Category Name</label>
            <button onClick={() => setisOpen(false)} className="cursor-pointer">
              <Delete />
            </button>
          </div>
          <input
            onChange={(e) => setSubCategoryName(e.target.value)}
            name="subcategoryname"
            type="text"
            className="border p-1 rounded outline-none"
          />
          <button
            disabled={adding}
            onClick={addsubcategory}
            className="bg-zinc-300  ring cursor-pointer active:scale-98 ring-zinc-400 text-white rounded px-2 py-2"
          >
            {adding ? <span>....</span> : <span>Add</span>}
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default AddSubCategory;
