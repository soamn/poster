"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect, useRef, useState } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useRouter } from "next/navigation";
import { Category, Subcategory } from "@/app/generated/prisma";
import { useNotification } from "../notification";
type CategoryWithSubcategory = Category & {
  subcategories?: Subcategory[];
};

const SavePlugin = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File>();
  const [categories, setCategories] = useState<CategoryWithSubcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    number | null
  >();
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/category");
    const response = await res.json();
    setCategories(response.message.categories);
    setLoading(false);
  };
  const saveHtml = () => {
    setLoading(true);
    if (
      !title ||
      !description ||
      !slug ||
      !tags ||
      !selectedCategory ||
      !selectedSubCategory
    ) {
      setLoading(false);
      showNotification("All fields are required", "error", 1500);
      return;
    }
    editor.update(async () => {
      const htmlString = $generateHtmlFromNodes(editor, null);

      const data = new FormData();
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }
      data.append("title", title);
      data.append("description", description);
      data.append("tags", tags);
      data.append("slug", slug);
      data.append("content", htmlString);
      data.append("category", selectedCategory.toString());
      data.append("subcategory", selectedSubCategory.toString());
      try {
        const res = await fetch("/api/post", {
          method: "POST",
          body: data,
        });
        const response = await res.json();
        setLoading(false);
        showNotification(response.message, "success", 1500);
        router.push(`/admin/editor/${response.post}`);
      } catch (error) {
        showNotification("Failed to complete request", "error", 1000);
        setLoading(false);
      }
    });
  };

  return (
    <div className="relative rounded-4xl p-5  bg-white  ">
      <div className="w-full grid grid-cols-2 place-items-center gap-4">
        <div>
          <label htmlFor="title" className="block font-bold">
            Enter Meta Title?
          </label>
          <input
            onChange={(e) => {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
              setTitle(e.target.value);
            }}
            name="title"
            id="title"
            type="text"
            placeholder="Enter meta title"
            className="outline p-2 rounded-lg bg-white"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-bold">
            Enter Meta Description?
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            id="description"
            placeholder="Enter meta description"
            className="outline p-2 rounded-lg bg-white"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block font-bold">
            Enter Meta Tags ?
          </label>
          <input
            onChange={(e) => setTags(e.target.value)}
            name="tags"
            id="tags"
            type="text"
            placeholder="Enter meta tags"
            className="outline p-2 rounded-lg bg-white"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block font-bold">
            Enter Slug ?
          </label>
          <input
            onChange={(e) => {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
            }}
            name="slug"
            id="slug"
            type="text"
            value={slug}
            placeholder="Enter Slugs"
            className="outline p-2 rounded-lg bg-white"
          />
        </div>
        <div>
          {/* Category select */}
          <div>
            <label htmlFor="category" className="block font-bold">
              Select Category
            </label>
            <select
              className="outline p-2 rounded-lg bg-white"
              id="category"
              value={selectedCategory ?? ""}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setSelectedCategory(id);
                setSelectedSubCategory(null); // reset subcategory on category change
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory select */}
          {selectedCategory && (
            <div>
              <label htmlFor="subcategory" className="block font-bold">
                Select Subcategory
              </label>
              <select
                className="outline p-2 rounded-lg bg-white"
                id="subcategory"
                value={selectedSubCategory ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedSubCategory(id);
                }}
              >
                <option value="">Select Subcategory</option>
                {categories
                  .find((cat) => cat.id === selectedCategory)
                  ?.subcategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <input
            hidden
            ref={thumbnailRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setThumbnail(file);
              }
            }}
            name="thumbnail"
            id="thumbnail"
            type="file"
            accept="image/*"
            className="outline p-2 rounded-lg hidden bg-white"
          />
          <button
            className="p-2 bg-zinc-900 text-white rounded-lg"
            onClick={() => thumbnailRef?.current?.click()}
          >
            {thumbnail ? thumbnail.name : "Upload Thumbnail "}
          </button>
        </div>
      </div>
      <div className=" w-full flex justify-center items-center mt-5 space-x-2">
        <button
          onClick={saveHtml}
          className="bg-zinc-800 rounded-lg text-white px-3 p-2 cursor-pointer  "
        >
          Save
        </button>
      </div>
      {loading && (
        <div className="absolute rounded-4xl inset-0 bg-white/30 backdrop-blur-2xl flex items-center justify-center z-50">
          <span className="text-lg font-semibold">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default SavePlugin;
