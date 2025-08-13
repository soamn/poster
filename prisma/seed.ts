import { auth } from "@/lib/auth";
import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

export async function main() {
  await prisma.role.create({
    data: {
      name: "Admin",
    },
  });
  await prisma.role.createMany({
    data: [
      {
        name: "Editor",
      },
      {
        name: "User",
      },
    ],
  });

  await auth.api.signUpEmail({
    body: {
      name: "Admin",
      email: `${process.env.EMAIL_ID}`,
      password: `${process.env.EMAIL_PASSWORD}`,
      image: "https://avatars.githubusercontent.com/u/134830116?v=4",
      roleId: 1,
    },
  });

  console.log("✅ Seeded user admin@example.com / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
