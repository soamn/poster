import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RevalidateSite } from "@/lib/revalidator";
import { revalidatePath } from "next/cache";
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
  const { name, sites } = body;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name,
      },
    });
    if (existingCategory) {
      return NextResponse.json({
        status: 400,
        message: `${existingCategory.name} Category already exists`,
        success: false,
      });
    }
    const category = await prisma.category.create({
      data: {
        name: name,
        sites,
      },
    });

    return NextResponse.json({
      status: 200,
      message: `${category.name} created successfully`,
      success: true,
    });
  } catch (error) {
    console.error(error);
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
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name,
      },
    });
    if (existingCategory) {
      return NextResponse.json({
        status: 400,
        message: `${existingCategory.name} Category already exists`,
        success: false,
      });
    }
    const session = await auth.api.getSession({ headers: req.headers });
    if ((session?.user.role?.id as number) !== 1) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Access denied",
      });
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
    });
    revalidatePath("/admin/categories");
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
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, sites } = body;
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if ((session?.user.role?.id as number) !== 1) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Access denied",
      });
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        sites,
      },
    });
    revalidatePath("/admin/categories");
    RevalidateSite(category, "category");

    return NextResponse.json({
      status: 200,
      message: `Updated sites in ${category.name}  successfully`,
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
    const session = await auth.api.getSession({ headers: req.headers });
    if ((session?.user.role?.id as number) !== 1) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Access denied",
      });
    }
    const category = await prisma.category.delete({
      where: {
        id,
      },
    });
    revalidatePath("/admin/categories");
    RevalidateSite(category, "category");
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
