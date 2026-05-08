import { Router } from "express";
import { db } from "@workspace/db";
import { dataRoomTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { CreateDataRoomItemBody, UpdateDataRoomItemBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const conditions = [];
  if (req.query.engagementId) {
    conditions.push(eq(dataRoomTable.engagementId, parseInt(req.query.engagementId as string, 10)));
  }
  const rows = await db.select().from(dataRoomTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(dataRoomTable.category, dataRoomTable.itemName);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreateDataRoomItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(dataRoomTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = UpdateDataRoomItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.update(dataRoomTable).set(parsed.data).where(eq(dataRoomTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

export default router;
