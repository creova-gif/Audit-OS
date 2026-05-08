import { useListEngagements } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function EngagementsPage() {
  const { data: engagements, isLoading } = useListEngagements();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engagements</h1>
          <p className="text-muted-foreground mt-1">Manage firm audit engagements.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Engagement
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4">
          {engagements?.map(engagement => (
            <Link key={engagement.id} href={`/engagements/${engagement.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer cursor-pointer shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{engagement.engagementName}</h3>
                    <p className="text-sm text-muted-foreground">{engagement.client?.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{engagement.status}</Badge>
                    <Badge variant={engagement.overallRisk === "high" || engagement.overallRisk === "critical" ? "destructive" : "secondary"}>
                      Risk: {engagement.overallRisk}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
