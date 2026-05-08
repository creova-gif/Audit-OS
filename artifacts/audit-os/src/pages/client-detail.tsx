import { useParams } from "wouter";
import { useGetClient } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientDetailPage() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: client, isLoading } = useGetClient(id);

  if (isLoading) return <Skeleton className="w-full h-96" />;
  if (!client) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
      <p>Industry: {client.industry}</p>
    </div>
  );
}
