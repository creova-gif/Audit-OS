import { Router } from "express";
import { db } from "@workspace/db";
import {
  engagementsTable,
  anomaliesTable,
  findingsTable,
  clientsTable,
  staffTable,
  workingPapersTable,
} from "@workspace/db/schema";
import { eq, sql, count, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const [engagementStats] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) filter (where ${engagementsTable.status} != 'completed')`,
    })
    .from(engagementsTable);

  const [anomalyStats] = await db
    .select({
      unreviewed: sql<number>`count(*) filter (where ${anomaliesTable.auditorStatus} = 'unreviewed')`,
      critical: sql<number>`count(*) filter (where ${anomaliesTable.riskLevel} = 'critical')`,
    })
    .from(anomaliesTable);

  const [findingStats] = await db
    .select({
      open: sql<number>`count(*) filter (where ${findingsTable.status} = 'open' or ${findingsTable.status} = 'escalated')`,
      total: count(),
    })
    .from(findingsTable);

  const [{ totalClients }] = await db
    .select({ totalClients: count() })
    .from(clientsTable);

  const [{ totalStaff }] = await db
    .select({ totalStaff: count() })
    .from(staffTable);

  const [wpStats] = await db
    .select({
      pendingSignOff: sql<number>`count(*) filter (where ${workingPapersTable.status} = 'reviewed')`,
    })
    .from(workingPapersTable);

  const recentAnomalies = await db
    .select()
    .from(anomaliesTable)
    .orderBy(desc(anomaliesTable.createdAt))
    .limit(5);

  const recentFindings = await db
    .select()
    .from(findingsTable)
    .orderBy(desc(findingsTable.createdAt))
    .limit(5);

  const engagementsByStatus = await db
    .select({
      status: engagementsTable.status,
      count: count(),
    })
    .from(engagementsTable)
    .groupBy(engagementsTable.status);

  const anomaliesByType = await db
    .select({
      anomalyType: anomaliesTable.anomalyType,
      count: count(),
    })
    .from(anomaliesTable)
    .groupBy(anomaliesTable.anomalyType);

  res.json({
    activeEngagements: Number(engagementStats?.active ?? 0),
    totalEngagements: Number(engagementStats?.total ?? 0),
    unreviewedAnomalies: Number(anomalyStats?.unreviewed ?? 0),
    criticalAnomalies: Number(anomalyStats?.critical ?? 0),
    openFindings: Number(findingStats?.open ?? 0),
    totalFindings: Number(findingStats?.total ?? 0),
    totalClients: Number(totalClients ?? 0),
    totalStaff: Number(totalStaff ?? 0),
    workingPapersPendingSignOff: Number(wpStats?.pendingSignOff ?? 0),
    recentAnomalies,
    recentFindings,
    engagementsByStatus,
    anomaliesByType,
  });
});

export default router;
