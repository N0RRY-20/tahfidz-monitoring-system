import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconUserPlus,
  IconTrash,
  IconMail,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { User } from "./types";

interface UserTableProps {
  users: User[];
  onAssignRole: (user: User) => void;
  onRemoveRole: (user: User, roleId: string, roleName: string) => void;
}

export function UserTable({
  users,
  onAssignRole,
  onRemoveRole,
}: UserTableProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tanggal Daftar</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Tidak ada user ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <IconMail className="size-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.roles.length === 0 ? (
                    <Badge
                      variant="outline"
                      className="text-amber-600 border-amber-300"
                    >
                      Menunggu Verifikasi
                    </Badge>
                  ) : (
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.map((role) => (
                        <Badge
                          key={role.id}
                          variant={
                            role.name === "admin"
                              ? "default"
                              : role.name === "guru"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {(() => {
                    try {
                      return format(new Date(user.createdAt), "dd MMM yyyy", {
                        locale: idLocale,
                      });
                    } catch {
                      return "-";
                    }
                  })()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onAssignRole(user)}>
                          <IconUserPlus className="mr-2 size-4" />
                          Assign Role
                        </DropdownMenuItem>
                        {user.roles.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            {user.roles.map((role) => (
                              <DropdownMenuItem
                                key={role.id}
                                onClick={() =>
                                  onRemoveRole(user, role.id, role.name)
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <IconTrash className="mr-2 size-4" />
                                Hapus role {role.name}
                              </DropdownMenuItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
