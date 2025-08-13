import React from "react";
import PostTable from "./postTable";
import prisma from "@/lib/prisma";

const page = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      category: true,
      subcategory: true,
    },
  });

  return (
    <>
      <div className="p-2 bg-gradient-to-r from-cyan-100 to-amber-100 ml-8 mr-8 rounded-4xl  bg-opacity-60">
        <div className="flex flex-col space-y-4 p-5 rounded-4xl bg-white/60  h-screen">
          <PostTable posts={posts} />
        </div>
      </div>
    </>
  );
};

export default page;
