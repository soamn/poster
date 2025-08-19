import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../app/generated/prisma/client";
import { customSession } from "better-auth/plugins";
const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  user: {
    modelName: "user",
    fields: {
      name: "name",
      email: "email",
      password: "password",
    },
    additionalFields: {
      roleId: {
        type: "number",
        required: true,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      // Fetch extra data from the database
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { role: true },
      });

      return {
        user: {
          ...user,
          role: dbUser?.role,
        },
        session,
      };
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    allowSignUp: false,
  },
  trustedOrigins: [`${process.env.NEXT_PUBLIC_API_URL}`],
});
