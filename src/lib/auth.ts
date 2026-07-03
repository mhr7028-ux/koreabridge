import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Determine the admin email from environment variable or fallback
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "mhr7028@gmail.com";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_secret",
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || "mock_line_id",
      clientSecret: process.env.LINE_CLIENT_SECRET || "mock_line_secret",
    }),
    {
      id: "wechat",
      name: "WeChat",
      type: "oauth",
      authorization: "https://open.weixin.qq.com/connect/qrconnect",
      token: "https://api.weixin.qq.com/sns/oauth2/access_token",
      userinfo: "https://api.weixin.qq.com/sns/userinfo",
      clientId: process.env.WECHAT_APP_ID || "mock_wechat_id",
      clientSecret: process.env.WECHAT_APP_SECRET || "mock_wechat_secret",
      profile(profile: any) {
        return {
          id: profile.openid,
          name: profile.nickname,
          image: profile.headimgurl,
        };
      },
    }
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Fetch fresh user data from DB on each token update or initial sign in
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.snsType = dbUser.snsType;
          token.snsId = dbUser.snsId;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).snsType = token.snsType;
        (session.user as any).snsId = token.snsId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Use our custom login page
  },
};
