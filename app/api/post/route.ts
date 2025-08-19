import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const tags = formData.get("tags") as string;
  const content = formData.get("content") as string;
  const categoryId = parseInt(formData.get("category") as string);
  const subCategoryId = parseInt(formData.get("subcategory") as string);
  const file = formData.get("thumbnail") as File;
  const session = await auth.api.getSession({ headers: req.headers });

  if (
    (session?.user.role?.id as number) !== 1 &&
    (session?.user?.role?.id as number) !== 2
  ) {
    return NextResponse.json({
      status: 401,
      success: false,
      message: "Access denied",
    });
  }
  try {
    const exisitingPost = await prisma.post.findFirst({
      where: {
        slug: slug,
      },
    });
    if (exisitingPost) {
      return NextResponse.json({
        status: 403,
        success: false,
        message: "Post already exists with this slug",
      });
    }

    let thumbnailPath = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const webpBuffer = await sharp(buffer).webp({ quality: 100 }).toBuffer();
      const fileName = `${Date.now()}-${file.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: fileName,
        Body: webpBuffer,
        ContentType: "image/*",
      });

      await r2.send(command);
      thumbnailPath = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    }
    const author = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
      },
      select: {
        id: true,
      },
    });
    if (!author) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Post failed",
      });
    }
    const post = await prisma.post.create({
      data: {
        title,
        description,
        slug,
        tags,
        content,
        category: {
          connect: {
            id: categoryId,
          },
        },
        subcategory: {
          connect: {
            id: subCategoryId,
          },
        },
        thumbnail: thumbnailPath,
        author: {
          connect: {
            id: author.id,
          },
        },
      },
      include: { category: true },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Post created successfully",
      post: post.id,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "An Error Occurred",
    });
  }
}
