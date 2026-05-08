import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, AlertTriangle, Search, FileCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-xl mt-6" />
      </div>
    );
  }

  if (!summary) return <div>Failed to load dashboard</div>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Firm Overview</h1>
        <p className="text-muted-foreground mt-2">Real-time metrics across all active audit engagements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Engagements</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeEngagements}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {summary.totalEngagements} total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unreviewed Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.unreviewedAnomalies}</div>
            <p className="text-xs text-muted-foreground mt-1">{summary.criticalAnomalies} critical</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Findings</CardTitle>
            <Search className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.openFindings}</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring action</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Sign-off</CardTitle>
            <FileCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.workingPapersPendingSignOff}</div>
            <p className="text-xs text-muted-foreground mt-1">Working papers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Findings</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.recentFindings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent findings.</p>
            ) : (
              <div className="space-y-4">
                {summary.recentFindings.slice(0, 5).map(finding => (
                  <div key={finding.id} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{finding.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{finding.findingRef}</p>
                    </div>
                    <Badge variant={finding.riskLevel === 'high' || finding.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                      {finding.riskLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent GL Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.recentAnomalies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent anomalies.</p>
            ) : (
              <div className="space-y-4">
                {summary.recentAnomalies.slice(0, 5).map(anomaly => (
                  <div key={anomaly.id} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{anomaly.anomalyType}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{anomaly.journalRef}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm tabular-nums">${anomaly.amount?.toLocaleString()}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{anomaly.auditorStatus}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
