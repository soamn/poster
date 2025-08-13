import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalRoles = await prisma.role.count();
    const totalPosts = await prisma.post.count();
    const publishedPosts = await prisma.post.count({
      where: { published: true },
    });
    const draftPosts = totalPosts - publishedPosts;

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    });
    const newPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users: {
            total: totalUsers,
            newLast7Days: newUsers,
          },
          roles: {
            total: totalRoles,
          },
          posts: {
            total: totalPosts,
            published: publishedPosts,
            draft: draftPosts,
            newPosts: newPosts,
          },
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500 }
    );
  }
}
