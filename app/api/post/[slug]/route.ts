import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { params } = context;
  const slug = (await params).slug;
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(slug),
      },
      include: {
        category: true,
        subcategory: true,
      },
    });
    if (!post) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Post Not Found",
      });
    }
    return NextResponse.json({
      status: 200,
      success: true,
      message: { post },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Failed to complete the request",
    });
  }
}
// export async function PATCH(
//   req: NextRequest,
//   context: { params: Promise<{ slug: string }> }
// ) {
//   const { params } = context;
//   const slug = (await params).slug;
//   try {
//     const likedPost = await prisma.post.findFirst({
//       where: {
//         slug,
//       },
//       select: {
//         Likes: true,
//       },
//     });
//     let likes = likedPost?.Likes;
//     if (!likes) {
//       likes = 0;
//     }
//     likes++;
//     const updatedPost = await prisma.post.update({
//       where: { slug },
//       data: { Likes: likes },
//       select: { Likes: true, slug: true },
//     });
//     revalidatePath("/");
//     revalidatePath("/admin/dashboard");
//     return NextResponse.json({
//       success: true,
//       status: 200,
//       message: updatedPost,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       status: 500,
//       success: false,
//       message: "Failed to complete the request",
//     });
//   }
// }
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const tags = formData.get("tags") as string;
  const published = formData.get("published") as string;
  const featured = formData.get("featured") as string;
  const content = formData.get("content") as string;
  const category = parseInt(formData.get("category") as string);
  const subcategory = parseInt(formData.get("subcategory") as string);
  const file = formData.get("thumbnail") as File;
  const { params } = context;
  const id = (await params).slug;

  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (
      (session?.user.role?.id as number) !== 1 ||
      (session?.user?.role?.id as number) !== 2
    ) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Access denied",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
    });

    let thumbnailPath = post?.thumbnail ?? "";
    if (file && post?.thumbnail) {
      const publicPrefix = process.env.R2_PUBLIC_URL!;
      const key = post.thumbnail.replace(`${publicPrefix}/`, "");

      if (key) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
          })
        );
      }
    }

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

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        slug,
        tags,
        content,
        category: {
          connect: { id: category },
        },
        subcategory: {
          connect: { id: subcategory },
        },
        published: published === "1",
        featured: featured === "1",
        thumbnail: thumbnailPath,
      },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Failed to complete the request",
    });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if ((session?.user.role?.id as number) !== 1) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Access denied",
      });
    }
    const { params } = context;
    const id = (await params).slug;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Post not found",
      });
    }

    if (post.thumbnail) {
      const publicPrefix = process.env.R2_PUBLIC_URL!;
      const key = post.thumbnail.replace(`${publicPrefix}/`, "");

      if (key) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
          })
        );
      }
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Failed to complete the request",
    });
  }
}
