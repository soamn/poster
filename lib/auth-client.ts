import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
});

export const { signIn, signUp, signOut, useSession } = authClient;
