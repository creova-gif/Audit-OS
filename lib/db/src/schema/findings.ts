import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const findingsTable = pgTable("findings", {
  id: serial("id").primaryKey(),
  engagementId: integer("engagement_id").notNull(),
  anomalyId: integer("anomaly_id"),
  findingRef: text("finding_ref").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  riskLevel: text("risk_level").notNull(),
  isaReference: text("isa_reference"),
  nbaaReference: text("nbaa_reference"),
  managementResponse: text("management_response"),
  status: text("status").notNull().default("open"),
  dueDate: text("due_date"),
  resolvedAt: text("resolved_at"),
  raisedBy: integer("raised_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertFindingSchema = createInsertSchema(findingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFinding = z.infer<typeof insertFindingSchema>;
export type Finding = typeof findingsTable.$inferSelect;
