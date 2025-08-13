import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, categoryId } = body;
  try {
    const subcategory = await prisma.subcategory.create({
      data: {
        name: name,
        categoryId: categoryId,
      },
    });
    return NextResponse.json({
      status: 200,
      message: `${subcategory.name} created successfully `,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: error,
    });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { name, id } = body;
  try {
    const subcategory = await prisma.subcategory.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json({
      status: 200,
      message: `Updated to ${subcategory.name}  successfully `,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Error",
    });
  }
}
// adjust to your prisma client path

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  try {
    const subcategory = await prisma.subcategory.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 200,
      message: `${subcategory.name} deleted successfully`,
      success: true,
    });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Cannot delete subcategory: It is related to other records.",
      });
    }

    return NextResponse.json({
      status: 500,
      success: false,
      message: "An unexpected error occurred.",
    });
  }
}
