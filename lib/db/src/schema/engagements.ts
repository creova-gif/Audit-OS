import { pgTable, text, serial, boolean, timestamp, integer, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const engagementsTable = pgTable("engagements", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  engagementName: text("engagement_name").notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  engagementType: text("engagement_type").notNull(),
  status: text("status").notNull().default("planning"),
  partnerId: integer("partner_id"),
  managerId: integer("manager_id"),
  materialityUsd: doublePrecision("materiality_usd"),
  performanceMatUsd: doublePrecision("performance_mat_usd"),
  overallRisk: text("overall_risk").notNull().default("medium"),
  reportDate: text("report_date"),
  signedOffAt: text("signed_off_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertEngagementSchema = createInsertSchema(engagementsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEngagement = z.infer<typeof insertEngagementSchema>;
export type Engagement = typeof engagementsTable.$inferSelect;
