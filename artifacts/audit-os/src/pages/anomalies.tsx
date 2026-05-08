import { useListAnomalies } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function AnomaliesPage() {
  const { data: anomalies, isLoading } = useListAnomalies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">GL Anomalies</h1>
        <p className="text-muted-foreground mt-1">Review flagged general ledger transactions.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-card">
          <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-sm text-muted-foreground bg-muted/50">
            <div>Reference</div>
            <div>Type</div>
            <div>Risk</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
          {anomalies?.map(anomaly => (
            <Link key={anomaly.id} href={`/anomalies/${anomaly.id}`}>
              <div className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer items-center text-sm">
                <div className="font-mono">{anomaly.journalRef}</div>
                <div>{anomaly.anomalyType}</div>
                <div>
                  <Badge variant={anomaly.riskLevel === "high" || anomaly.riskLevel === "critical" ? "destructive" : "outline"}>
                    {anomaly.riskLevel}
                  </Badge>
                </div>
                <div className="tabular-nums">${anomaly.amount?.toLocaleString()}</div>
                <div><Badge variant="secondary">{anomaly.auditorStatus}</Badge></div>
              </div>
            </Link>
          ))}
          {anomalies?.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No anomalies found.</div>
          )}
        </div>
      )}
    </div>
  );
}
