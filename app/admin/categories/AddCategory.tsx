"use client";
import { useNotification } from "@/app/components/notification";
import { Delete } from "lucide-react";
import React, { useState } from "react";

const AddCategory = () => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState("");
  const { showNotification } = useNotification();

  const addcategory = async () => {
    if (categoryName == "") {
      return;
    }
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "appication/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });
      const response = await res.json();
      if (response.status == 200) {
        setisOpen(false);
      }
      showNotification(response.message, "success", 1000);
    } catch (error) {}
  };
  return (
    <>
      <button
        hidden={isOpen}
        onClick={() => setisOpen(true)}
        className="bg-sky-300  cursor-pointer active:scale-98   rounded px-5 py-2"
      >
        Add Category
      </button>
      {isOpen ? (
        <div className="flex flex-col gap-1  ">
          <div className="flex w-full justify-between">
            <label htmlFor="categoryname"> Enter Category Name</label>
            <button onClick={() => setisOpen(false)} className="cursor-pointer">
              <Delete />
            </button>
          </div>
          <input
            onChange={(e) => {
              setCategoryName(e.target.value);
            }}
            name="categoryname"
            type="text"
            className="border p-1 rounded outline-none"
          />
          <button
            onClick={addcategory}
            className="bg-zinc-300 ring cursor-pointer active:scale-98 ring-zinc-400 text-white rounded px-2 py-2"
          >
            Add
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default AddCategory;
