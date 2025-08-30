import NextAuth from "next-auth";

// Extendemos el tipo Session para incluir 'role', 'user', etc.
declare module "next-auth" {
  interface Session {
    user: {
      name?: string;
      email?: string;
      user?: string;
      role?: "contador" | "cliente" | string;
      [key: string]: any;
    }
  }
}
