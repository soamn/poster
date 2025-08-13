import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const id = (await params).id;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "user Not Found",
      });
    }
        revalidatePath("/admin/users");
    
    return NextResponse.json({
      status: 200,
      success: true,
      message: { user },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Failed to complete the request",
    });
  }
}
