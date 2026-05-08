import { useListFindings } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function FindingsPage() {
  const { data: findings, isLoading } = useListFindings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Findings</h1>
          <p className="text-muted-foreground mt-1">Manage issues raised during engagements.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Raise Finding
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-card">
          <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-sm text-muted-foreground bg-muted/50">
            <div>Reference</div>
            <div className="col-span-2">Title</div>
            <div>Risk</div>
            <div>Status</div>
          </div>
          {findings?.map(finding => (
            <Link key={finding.id} href={`/findings/${finding.id}`}>
              <div className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer items-center text-sm">
                <div className="font-mono text-xs">{finding.findingRef}</div>
                <div className="col-span-2 font-medium">{finding.title}</div>
                <div>
                  <Badge variant={finding.riskLevel === "high" || finding.riskLevel === "critical" ? "destructive" : "outline"}>
                    {finding.riskLevel}
                  </Badge>
                </div>
                <div><Badge variant="secondary">{finding.status}</Badge></div>
              </div>
            </Link>
          ))}
          {findings?.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No findings.</div>
          )}
        </div>
      )}
    </div>
  );
}
