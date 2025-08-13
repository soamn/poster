import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, roleId } = body;
    if (!name || !email || !password || !roleId) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Missing Field",
      });
    }
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user?.role?.id !== 1) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Access denied",
      });
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Record already exists",
      });
    }
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        roleId: Number(roleId),
      },
    });
    return NextResponse.json({
      status: 201,
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Error",
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, password, roleId, oldpassword } = body;
    if (!id || !name || !email || !roleId || !oldpassword) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Missing Field",
      });
    }

    const user = await prisma.user.findFirst({
      where: { id },
    });
    const account = await prisma.account.findFirst({
      where: { userId: id },
      select: { id: true, password: true },
    });
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user?.role?.id !== 1 && session?.user.id !== user.id) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Access Denied",
      });
    }
    const verified = await verifyPassword({
      hash: account?.password as string,
      password: oldpassword,
    });
    if (!verified) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Password Incorrect",
      });
    }
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        roleId: Number(roleId),
      },
    });

    if (account && password) {
      const newpassword = await hashPassword(password);
      await prisma.account.update({
        where: { id: account.id },
        data: { password: newpassword },
      });
    }
    return NextResponse.json({
      status: 201,
      success: true,
      message: "User Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      status: 500,
      success: false,
      message: "Error",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user?.role?.id !== 1) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "You don't have access to perform this action",
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        roleId: true,
      },
    });

    if (user?.roleId === 1) {
      const adminCount = await prisma.user.findMany({
        where: {
          roleId: 1,
        },
        include: {
          _count: true,
        },
      });
      if (adminCount.length < 2) {
        return NextResponse.json({
          status: 400,
          success: false,
          message: "Atleast 1 Admin is needed",
        });
      }
    }
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 201,
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Error",
    });
  }
}
