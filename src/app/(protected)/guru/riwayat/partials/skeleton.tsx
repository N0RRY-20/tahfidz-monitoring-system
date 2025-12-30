import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RiwayatSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Alert skeleton */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Filter skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-10 w-48 rounded-md" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />

      {/* Table Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search bar skeleton */}
          <Skeleton className="h-10 w-full" />

          {/* Table skeleton */}
          <div className="rounded-lg border">
            {/* Header */}
            <div className="bg-muted/50 p-4 flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>

            {/* Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4 border-t">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-20" />
                <div className="ml-auto flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
