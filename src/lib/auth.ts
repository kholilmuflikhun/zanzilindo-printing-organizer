// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // PrismaAdapter menangani penyimpanan Account/Session otomatis untuk login
  // Google. Untuk login Credentials tetap pakai strategy "jwt" di bawah,
  // jadi adapter ini terutama berperan menyimpan data akun Google.
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "", // TODO: GANTI_DENGAN_GOOGLE_CLIENT_ID_ANDA
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "", // TODO: GANTI_DENGAN_GOOGLE_CLIENT_SECRET_ANDA
    }),
    CredentialsProvider({
      name: "Username or Email & Password",
      credentials: {
        identifier: { label: "Username atau Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = credentials.identifier.trim().toLowerCase();
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { username: identifier }],
          },
        });

        // user.passwordHash null berarti akun ini didaftarkan lewat Google,
        // bukan lewat form Register — tolak login credentials untuk akun itu.
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id || (token.sub && !token.role)) {
        const databaseUser = await prisma.user.findUnique({
          where: { id: user?.id ?? token.sub },
          select: { role: true },
        });
        token.role = databaseUser?.role;
      }
      return token;
    },
    async session({ session, token }) {
      // `session.user.id` sekarang benar-benar bertipe `string` berkat
      // augmentation di `src/types/next-auth.d.ts` — tidak perlu cast manual
      // lagi seperti sebelumnya. `token.sub` = user id (standar JWT NextAuth).
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // TODO: GANTI_DENGAN_RANDOM_STRING (openssl rand -base64 32)
};
