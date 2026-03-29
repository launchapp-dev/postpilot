import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
});

export const socialAccounts = sqliteTable("social_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  platform: text("platform").notNull(),
  username: text("username").notNull(),
  accessToken: text("access_token"),
  status: text("status").notNull().default("active"),
});

export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  startsAt: int("starts_at", { mode: "timestamp" }),
  endsAt: int("ends_at", { mode: "timestamp" }),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("draft"),
  scheduledAt: int("scheduled_at", { mode: "timestamp" }),
  publishedAt: int("published_at", { mode: "timestamp" }),
  campaignId: text("campaign_id").references(() => campaigns.id),
});
