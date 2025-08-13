import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });
  return NextResponse.json({
    status: 200,
    success: true,
    message: { categories: categories },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body;
  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json({
      status: 200,
      message: `${category.name} created successfully`,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "An unexpected error occured",
    });
  }
}
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { name, id } = body;
  try {
    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json({
      status: 200,
      message: `Updated to ${category.name}  successfully`,
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

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  try {
    const category = await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: `${category.name} deleted successfully`,
      success: true,
    });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Cannot delete category: It is related to other records.",
      });
    }
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Error",
    });
  }
}
