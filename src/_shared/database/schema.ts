import { sql, relations } from "npm:drizzle-orm";

import {
  pgTable,
  varchar,
  timestamp,
  uuid as uuidColumn,
} from "npm:drizzle-orm/pg-core";

export const usersColumns =  {
  id: uuidColumn('id').primaryKey().$default(() => crypto.randomUUID()),
  first_name: varchar('first_name').notNull(),
  last_name: varchar('last_name').notNull(),
  idp_level: varchar('idp_level').notNull(),
  idp_id: varchar('idp_id').notNull(),
  id_language: uuidColumn('id_language').notNull().references(() => languages.id),
  status: varchar('status').notNull(),
  gender: varchar('gender').notNull(),
  created_at: timestamp("created_at").default(sql`now()`).notNull(),
  updated_at: timestamp("updated_at").notNull(),
}

export const emailsColumns =  {
  id: uuidColumn('id').primaryKey().$default(() => crypto.randomUUID()).notNull(),
  email: varchar('email').notNull(),
  type: varchar('type').notNull(),
  status: varchar('status').notNull(),
  id_user: uuidColumn('id_user').references(() => users.id).notNull(),
  created_at: timestamp("created_at").default(sql`now()`).notNull(),
  updated_at: timestamp("updated_at").notNull(),
}

export const languageColumns =  {
  id: uuidColumn('id').primaryKey().$default(() => crypto.randomUUID()).notNull(),
  name: varchar('name').notNull().notNull(),
  code: varchar('code').notNull().notNull(),
  created_at: timestamp("created_at").default(sql`now()`).notNull(),
  updated_at: timestamp("updated_at").notNull(),
}

export const users = pgTable('data_users', usersColumns);
export const emails = pgTable('data_emails', emailsColumns);
export const languages = pgTable('data_languages', languageColumns);

export const usersRelations = relations(users, ({ many, one }) => ({
  emails: many(emails),
  language: one(languages, {
    fields: [users.id_language],
    references: [languages.id],
  }),
}));

export const emailsRelations = relations(emails, ({ one }) => ({
  user: one(users, {
    fields: [emails.id_user],
    references: [users.id],
  }),
}));

type TEmails = typeof emails.$inferSelect;
export type TUserInfo = typeof users.$inferSelect

export interface IUserInfo extends TUserInfo {
  emails: Array<TEmails>
  language: typeof languages.$inferSelect;
  created_at: Date;
  updated_at: Date;
}

export const schema = {
  users,
  emails,
  languages,
  usersRelations,
  emailsRelations
}
