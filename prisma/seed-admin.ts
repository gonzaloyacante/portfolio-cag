import 'dotenv/config';

import { auth } from '../src/lib/auth';
import { prisma } from '../src/lib/prisma';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD env vars required');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error('Admin user already exists:', email);
    return;
  }

  await auth.api.signUpEmail({
    body: { email, password, name },
  });

  console.error('Admin user created:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
