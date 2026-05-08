import { useParams } from "wouter";
import { useGetEngagement } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EngagementDetailPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: engagement, isLoading } = useGetEngagement(id);

  if (isLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (!engagement) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{engagement.engagementName}</h1>
        <p className="text-muted-foreground mt-1">Client: {engagement.client?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Status</CardTitle></CardHeader>
          <CardContent><Badge>{engagement.status}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Risk Level</CardTitle></CardHeader>
          <CardContent><Badge variant="outline">{engagement.overallRisk}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Materiality</CardTitle></CardHeader>
          <CardContent><div className="font-medium">${engagement.materialityUsd?.toLocaleString() || "N/A"}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="anomalies">
        <TabsList>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="papers">Working Papers</TabsTrigger>
          <TabsTrigger value="data-room">Data Room</TabsTrigger>
        </TabsList>
        <TabsContent value="anomalies" className="mt-4">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Anomaly list for engagement {id} goes here.</CardContent></Card>
        </TabsContent>
        <TabsContent value="findings" className="mt-4">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Findings for engagement {id} goes here.</CardContent></Card>
        </TabsContent>
        <TabsContent value="papers" className="mt-4">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Working Papers for engagement {id} goes here.</CardContent></Card>
        </TabsContent>
        <TabsContent value="data-room" className="mt-4">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Data Room for engagement {id} goes here.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
