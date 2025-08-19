import Editor from "@/components/editor";
import prisma from "@/lib/prisma";
import React from "react";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const postId = Number(id);

  if (isNaN(postId)) {
    notFound();
    return;
  }
  const content = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    select: {
      content: true,
    },
  });
  let html = "Hi";
  if (content) {
    html = content.content;
  }
  return (
    <div className="relative  ml-5 mr-5 max-w-9xl ">
      <Editor html={html} isUpdate={true} />
    </div>
  );
};

export default page;
