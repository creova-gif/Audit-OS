import { Router } from "express";
import { db } from "@workspace/db";
import { clientsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { CreateClientBody, UpdateClientBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(clientsTable).orderBy(clientsTable.name);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(clientsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [row] = await db.select().from(clientsTable).where(eq(clientsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = UpdateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.update(clientsTable).set(parsed.data).where(eq(clientsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

export default router;
