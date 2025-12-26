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
import { Card, CardContent } from "@/components/ui/card";

export function ReportsTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="pt-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DataTable Skeleton */}
      <div className="w-full flex-col justify-start gap-6">
        {/* Toolbar Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Skeleton className="h-10 w-full md:w-64" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        {/* Table Body Skeleton */}
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-20 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-8 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-8 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-8 mx-auto rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between py-4 flex-col md:flex-row gap-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-4 md:gap-8">
            <Skeleton className="h-8 w-32 hidden md:block" />
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
