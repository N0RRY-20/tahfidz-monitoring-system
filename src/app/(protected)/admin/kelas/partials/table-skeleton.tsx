import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function KelasTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-md">
        <Skeleton className="h-10 w-full sm:w-[250px]" />
        <Skeleton className="h-10 w-full sm:w-[100px]" />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[150px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[200px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[50px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Skeleton className="h-10 w-full sm:w-[100px]" />
        <Skeleton className="h-10 w-full sm:w-[100px]" />
      </div>
    </div>
  );
}
