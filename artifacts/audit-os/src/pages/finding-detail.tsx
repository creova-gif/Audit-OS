import { useParams } from "wouter";
import { useGetFinding } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FindingDetailPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: finding, isLoading } = useGetFinding(id);

  if (isLoading) return <Skeleton className="w-full h-96" />;
  if (!finding) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{finding.title}</h1>
      <p className="text-muted-foreground">{finding.findingRef} - Status: {finding.status}</p>
      
      <div className="prose prose-sm dark:prose-invert">
        <p>{finding.description}</p>
      </div>
    </div>
  );
}
