import { Router } from "express";
import { db } from "@workspace/db";
import { findingsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { CreateFindingBody, UpdateFindingBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const conditions = [];
  if (req.query.engagementId) {
    conditions.push(eq(findingsTable.engagementId, parseInt(req.query.engagementId as string, 10)));
  }
  if (req.query.status) {
    conditions.push(eq(findingsTable.status, req.query.status as string));
  }
  const rows = await db.select().from(findingsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(findingsTable.createdAt);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreateFindingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await db.select({ id: findingsTable.id }).from(findingsTable)
    .where(eq(findingsTable.engagementId, parsed.data.engagementId));
  const findingRef = `FIND-${String(existing.length + 1).padStart(3, "0")}`;
  const [row] = await db.insert(findingsTable).values({ ...parsed.data, findingRef }).returning();
  res.status(201).json(row);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [row] = await db.select().from(findingsTable).where(eq(findingsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = UpdateFindingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.update(findingsTable).set(parsed.data).where(eq(findingsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

export default router;
