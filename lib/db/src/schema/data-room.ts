import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dataRoomTable = pgTable("data_room_items", {
  id: serial("id").primaryKey(),
  engagementId: integer("engagement_id").notNull(),
  category: text("category").notNull(),
  itemName: text("item_name").notNull(),
  description: text("description"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  dueDate: text("due_date"),
  receivedAt: text("received_at"),
  fileName: text("file_name"),
  status: text("status").notNull().default("requested"),
  requestedBy: integer("requested_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDataRoomSchema = createInsertSchema(dataRoomTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDataRoom = z.infer<typeof insertDataRoomSchema>;
export type DataRoom = typeof dataRoomTable.$inferSelect;
