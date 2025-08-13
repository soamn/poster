"use client";

import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

type UserWithRole = {
  user: User | null;
  role: Number | null;
};

type UserContextType = {
  getUserdata: () => UserWithRole;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState<Number>();
  useEffect(() => {
    authClient.getSession().then((session) => {
      setUser(session.data?.user);
      setRole(session.data?.user.role?.id);
    });
  }, []);

  const getUserdata = useCallback(() => {
    return {
      user: user ?? null,
      role: role ?? null,
    };
  }, [user, role]);

  return (
    <UserContext.Provider value={{ getUserdata }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
