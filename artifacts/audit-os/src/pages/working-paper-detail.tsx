import { useParams } from "wouter";
import { useGetWorkingPaper } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkingPaperDetailPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: paper, isLoading } = useGetWorkingPaper(id);

  if (isLoading) return <Skeleton className="w-full h-96" />;
  if (!paper) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{paper.title}</h1>
      <div className="bg-card border rounded p-4 text-sm whitespace-pre-wrap">
        {paper.contentText || "No content."}
      </div>
    </div>
  );
}
