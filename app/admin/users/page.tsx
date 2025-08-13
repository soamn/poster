import React from "react";
import prisma from "@/lib/prisma";
import UserTable from "./usersTable";

const page = async () => {
  const users = await prisma.user.findMany({
    include: {
      role: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <>
      <div className="p-2 bg-gradient-to-r from-cyan-100 to-amber-100  ml-8 mr-8 rounded-4xl  bg-opacity-60">
        <div className="flex flex-col space-y-4 p-5 rounded-4xl bg-white/60  h-screen">
          <UserTable users={users} />
        </div>
      </div>
    </>
  );
};

export default page;
