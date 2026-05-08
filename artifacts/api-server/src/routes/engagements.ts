import { Router } from "express";
import { db } from "@workspace/db";
import { engagementsTable, clientsTable, staffTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { CreateEngagementBody, UpdateEngagementBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db
    .select({
      id: engagementsTable.id,
      clientId: engagementsTable.clientId,
      engagementName: engagementsTable.engagementName,
      periodStart: engagementsTable.periodStart,
      periodEnd: engagementsTable.periodEnd,
      engagementType: engagementsTable.engagementType,
      status: engagementsTable.status,
      partnerId: engagementsTable.partnerId,
      managerId: engagementsTable.managerId,
      materialityUsd: engagementsTable.materialityUsd,
      performanceMatUsd: engagementsTable.performanceMatUsd,
      overallRisk: engagementsTable.overallRisk,
      reportDate: engagementsTable.reportDate,
      signedOffAt: engagementsTable.signedOffAt,
      notes: engagementsTable.notes,
      createdAt: engagementsTable.createdAt,
      updatedAt: engagementsTable.updatedAt,
      clientName: clientsTable.name,
    })
    .from(engagementsTable)
    .leftJoin(clientsTable, eq(engagementsTable.clientId, clientsTable.id))
    .orderBy(engagementsTable.createdAt);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreateEngagementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(engagementsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [row] = await db
    .select({
      id: engagementsTable.id,
      clientId: engagementsTable.clientId,
      engagementName: engagementsTable.engagementName,
      periodStart: engagementsTable.periodStart,
      periodEnd: engagementsTable.periodEnd,
      engagementType: engagementsTable.engagementType,
      status: engagementsTable.status,
      partnerId: engagementsTable.partnerId,
      managerId: engagementsTable.managerId,
      materialityUsd: engagementsTable.materialityUsd,
      performanceMatUsd: engagementsTable.performanceMatUsd,
      overallRisk: engagementsTable.overallRisk,
      reportDate: engagementsTable.reportDate,
      signedOffAt: engagementsTable.signedOffAt,
      notes: engagementsTable.notes,
      createdAt: engagementsTable.createdAt,
      updatedAt: engagementsTable.updatedAt,
      clientName: clientsTable.name,
    })
    .from(engagementsTable)
    .leftJoin(clientsTable, eq(engagementsTable.clientId, clientsTable.id))
    .where(eq(engagementsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = UpdateEngagementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.update(engagementsTable).set(parsed.data).where(eq(engagementsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

export default router;
