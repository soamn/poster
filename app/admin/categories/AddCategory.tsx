"use client";
import { useNotification } from "@/components/notification";
import { PlusCircleIcon, X, Trash2 } from "lucide-react";
import React, { useState } from "react";

const AddCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [siteInput, setSiteInput] = useState("");
  const [sites, setSites] = useState<string[]>([]);
  const { showNotification } = useNotification();
  const [adding, setAdding] = useState(false);

  const addSite = () => {
    if (!siteInput.trim()) {
      showNotification("Site cannot be empty", "warning");
      return;
    }
    if (sites.includes(siteInput.trim())) {
      showNotification("Site already added", "warning");
      return;
    }
    setSites((prev) => [...prev, siteInput.trim()]);
    setSiteInput("");
  };

  const removeSite = (site: string) => {
    setSites((prev) => prev.filter((s) => s !== site));
  };

  const addCategory = async () => {
    if (!categoryName.trim()) {
      showNotification("Category name is required", "warning");
      return;
    }
    if (sites.length === 0) {
      showNotification("At least one site is required", "warning");
      return;
    }

    try {
      setAdding(true);
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName.trim(), sites }),
      });

      const response = await res.json();
      if (response.status === 200) {
        setIsOpen(false);
        setCategoryName("");
        setSites([]);
        showNotification(response.message, "success", 2000);
      } else {
        showNotification(response.message || "Something went wrong", "error");
      }
    } catch (error) {
      showNotification("Failed to add category", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-sky-300 cursor-pointer active:scale-95 rounded px-5 py-2"
        >
          Add Category
        </button>
      )}

      {isOpen && (
        <div className="flex flex-col gap-2  rounded-4xl p-5 w-full max-w-md bg-white ">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className=" text-md">New Category</h2>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">
              <X />
            </button>
          </div>

          {/* Category name */}
          <label className="text-sm font-medium">Category name</label>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
            className="border p-2 rounded outline-none"
            placeholder="Enter category name"
          />

          {/* Sites input */}
          <label className="text-sm font-medium">Sites</label>
          <div className="flex gap-2">
            <input
              value={siteInput}
              onChange={(e) => setSiteInput(e.target.value)}
              type="text"
              className="border p-2 flex-1 rounded outline-none"
              placeholder="Enter site (e.g. site.com)"
            />
            <button
              type="button"
              onClick={addSite}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              <PlusCircleIcon size={18} />
            </button>
          </div>

          {/* Site list */}
          {sites.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-2">
              {sites.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSite(s)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Submit */}
          <button
            disabled={adding}
            onClick={addCategory}
            className="bg-lime-600 text-white rounded px-4 py-2 mt-3 hover:bg-lime-700 "
          >
            {adding ? <span>....</span> : <span>Add Category</span>}
          </button>
        </div>
      )}
    </>
  );
};

export default AddCategory;
