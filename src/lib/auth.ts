import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { twoFactor } from 'better-auth/plugins';

import { prisma } from './prisma';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  console.warn(
    '[auth] requireEmailVerification is disabled. For a multi-admin setup this is a ' +
      'risk (forgot-password can be triggered for unverified emails). ' +
      'For this single-admin portfolio we keep it off so the admin can recover their account; ' +
      'a DB-side `emailVerified = true` on the admin row mitigates the risk.'
  );
}

export const auth = betterAuth({
  appName: 'portfolio-cag',
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [twoFactor()],
  advanced: {
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        },
      },
    },
    useSecureCookies: isProd,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
});
