import { useListWorkingPapers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function WorkingPapersPage() {
  const { data: papers, isLoading } = useListWorkingPapers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Working Papers</h1>
      
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="border rounded-md divide-y bg-card">
          {papers?.map(paper => (
            <Link key={paper.id} href={`/working-papers/${paper.id}`}>
              <div className="p-4 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
                <div>
                  <div className="font-medium">{paper.title}</div>
                  <div className="text-sm text-muted-foreground">{paper.wpRef}</div>
                </div>
                <div className="text-sm">{paper.status}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
