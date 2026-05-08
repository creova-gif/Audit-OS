import { useListClients } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function ClientsPage() {
  const { data: clients, isLoading } = useListClients();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
      
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients?.map(client => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <div className="border rounded-md p-6 bg-card hover:border-primary/50 cursor-pointer">
                <div className="font-bold text-lg">{client.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{client.industry}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
