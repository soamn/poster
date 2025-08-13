import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const roles = await prisma.role.findMany();
  return NextResponse.json({
    message: { success: true, roles },
  });
}
