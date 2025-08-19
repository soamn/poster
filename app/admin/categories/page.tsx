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
      <div className="  flex flex-col items-center  ">
        <AddCategory />
      </div>
      <CategoryTable categories={categories} />
    </>
  );
};

export default page;
