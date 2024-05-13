import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  type Session = {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      email: string;
      name: string;
      image: string;
    };
  };
}
