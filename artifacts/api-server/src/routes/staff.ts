import { Router } from "express";
import { db } from "@workspace/db";
import { staffTable } from "@workspace/db/schema";
import { CreateStaffBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(staffTable).orderBy(staffTable.createdAt);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreateStaffBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(staffTable).values(parsed.data).returning();
  res.status(201).json(row);
});

export default router;
