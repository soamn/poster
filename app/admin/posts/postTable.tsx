"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Category, Post, Subcategory, User } from "@/app/generated/prisma";
import { Pencil, Trash } from "lucide-react";
import BasicTable from "@/components/basictable";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/notification";
import { useUserProvider } from "@/components/userprovider";

type PostWithData = Post & {
  category: Category;
  subcategory: Subcategory;
  author: User;
};

type PostTableProps = {
  posts: PostWithData[];
};

const PostTable = ({ posts }: PostTableProps) => {
  const { showNotification } = useNotification();
  const router = useRouter();
  const onEdit = (post: PostWithData) => {
    router.push(`/admin/editor/${post.id}`);
  };

  const onDelete = async (post: PostWithData) => {
    try {
      const response = await fetch(`/api/post/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        showNotification(data.message, "info", 1500);
        router.refresh();
      } else {
        showNotification(data.message, "warning", 1500);
      }
    } catch (error) {
      showNotification("failed to delete", "error", 1500);
    }
  };
  const { getUserdata } = useUserProvider();
  const data = getUserdata();
  const columns: ColumnDef<PostWithData>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="flex space-x-2 items-center">
          <img
            src={`${
              row.original.thumbnail ? row.original.thumbnail : "/opengraph-image.jpg"
            }`}
            className="w-5 h-5 object-cover rounded"
          ></img>
          <span className="line-clamp-2">{row.original.title}</span>
        </span>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => row.original.category.name,
    },
    {
      accessorKey: "subcategory.name",
      header: "Subcategory",
      cell: ({ row }) => row.original.subcategory.name,
    },
    {
      accessorKey: "author.name",
      header: "Author",
      cell: ({ row }) => row.original.author.name,
    },
    {
      accessorKey: "author.email",
      header: "Email",
      cell: ({ row }) => row.original.author.email,
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <span className="flex space-x-2 items-center">
          {row.original.featured ? (
            <span className="bg-lime-300 h-2 w-full"></span>
          ) : (
            <span className="bg-amber-300 h-2 w-full"></span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "published",
      header: "published",
      cell: ({ row }) => (
        <span className="flex space-x-2 items-center ">
          {row.original.published ? (
            <span className="bg-blue-300 h-2 w-full"></span>
          ) : (
            <span className="bg-red-300 h-2 w-full"></span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
    },

    ...(data.role === 1 || data.role === 2
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => {
              const user = row.original;
              return (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="  text-xs cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="  text-xs cursor-pointer"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  return <BasicTable data={posts} columns={columns} />;
};

export default PostTable;
