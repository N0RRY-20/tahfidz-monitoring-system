"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SantriTableSkeleton() {
  return (
    <div className="w-full flex-col justify-start gap-6">
      {/* Header with search and buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          {/* Filter Kelas */}
          <Skeleton className="h-9 w-full sm:w-48" />
          {/* Search */}
          <Skeleton className="h-9 w-full sm:w-64" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Add Button */}
          <Skeleton className="h-9 w-full sm:w-32" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="h-4 w-10 mx-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-40" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-4 w-32 hidden lg:block" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24 hidden lg:block" />
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
