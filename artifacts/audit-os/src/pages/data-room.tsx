import { useListDataRoomItems } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DataRoomPage() {
  const { data: items, isLoading } = useListDataRoomItems();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Data Room</h1>
      
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="border rounded-md divide-y bg-card">
          {items?.map(item => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{item.itemName}</div>
                <div className="text-sm text-muted-foreground">{item.category}</div>
              </div>
              <div className="text-sm border px-2 py-1 rounded">{item.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
