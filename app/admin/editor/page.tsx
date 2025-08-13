import React from "react";
import Editor from "@/app/components/editor";

const page = () => {
  const html = "";
  return (
    <div className="relative  ml-5 mr-5 max-w-9xl ">
      <Editor html={html} isUpdate={false} />
    </div>
  );
};

export default page;
