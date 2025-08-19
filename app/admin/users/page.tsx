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
      <div className="p-2 bg-gradient-to-r from-cyan-100 to-amber-100  m-2 rounded-4xl lg:w-full w-screen bg-opacity-60">
        <div className="flex flex-col space-y-4 p-5 rounded-4xl bg-white/60  h-screen w-full">
          <UserTable users={users} />
        </div>
      </div>
    </>
  );
};

export default page;
