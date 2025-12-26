import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconSearch } from "@tabler/icons-react";

interface UserFiltersProps {
  filter: "all" | "verified" | "pending";
  setFilter: (value: "all" | "verified" | "pending") => void;
  search: string;
  setSearch: (value: string) => void;
  counts: {
    all: number;
    verified: number;
    pending: number;
  };
}

export function UserFilters({
  filter,
  setFilter,
  search,
  setSearch,
  counts,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">Semua ({counts.all})</TabsTrigger>
          <TabsTrigger value="verified">
            Terverifikasi ({counts.verified})
          </TabsTrigger>
          <TabsTrigger value="pending">Menunggu ({counts.pending})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full sm:w-64">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
