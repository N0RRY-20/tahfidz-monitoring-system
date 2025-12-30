import { Skeleton } from "@/components/ui/skeleton";

export function LogbookSkeleton() {
  return (
    <div className="space-y-6">
      {/* Records Skeleton */}
      <div>
        <Skeleton className="h-5 w-40 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <RecordCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecordCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Status circle */}
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          
          <div className="space-y-2">
            {/* Title + Badge */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            {/* Ayat */}
            <Skeleton className="h-4 w-28" />
            {/* Tags */}
            <div className="flex gap-1 mt-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-18 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Date */}
        <div className="text-right space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
