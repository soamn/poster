"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Role, User } from "@/app/generated/prisma";

import BasicTable from "@/app/components/basictable";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/app/components/notification";

type UserWithData = User & {
  role: Role;
  _count: {
    posts: number;
  };
};

type Props = {
  users: UserWithData[];
};

const UserTable = ({ users }: Props) => {
  const router = useRouter();
  const { showNotification } = useNotification();
  const onEdit = (user: UserWithData) => {
    router.push(`/admin/users/${user.id}`);
  };

  const onDelete = async (user: UserWithData) => {
    const res = await fetch(`/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id }),
    });

    const result = await res.json();
    if (result.success) {
      showNotification(result.message, "success", 1500);
    } else {
      showNotification(result.message, "warning", 1500);
    }
  };
  const columns: ColumnDef<UserWithData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <img
            className="w-5 h-5 object-cover rounded-full"
            src={`${
              row.original.image ? row.original.image : "/opengraph.jpg"
            }`}
            alt=""
          />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "_count.posts",
      header: "Posts",
    },

    {
      accessorKey: "role.name",
      header: "Role",
      cell: ({ row }) => row.original.role.name,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(user)}
              className=" text-xs cursor-pointer"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(user)}
              className="text-xs cursor-pointer"
            >
              <Trash size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return <BasicTable data={users} columns={columns} />;
};

export default UserTable;
