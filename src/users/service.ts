// Packages
import { eq } from "drizzle-orm";

// Services
import Database from '../_shared/database/index.ts';
import { users } from '#db/schemas'


export async function getByIdpId(id: string) {
  const db = await Database();
  const user = await db
    .query
    .users
    .findFirst({ where: eq(users.idp_id, id), with: { emails: true, language: true } });

  if (!user) {
    throw new Error('User not found');
  }

  return user!;
}