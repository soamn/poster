import React from "react";
import CategoryTable from "./categorytable";
import prisma from "@/lib/prisma";
import AddCategory from "./AddCategory";

const page = async () => {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });
  return (
    <>
      <CategoryTable categories={categories} />
      <div className="  flex flex-col items-center  ">
        <AddCategory />
      </div>
    </>
  );
};

export default page;
