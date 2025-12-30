"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { UserTableSkeleton } from "./partials/table-skeleton";
import { UserFilters } from "./partials/user-filters";
import { UserTable } from "./partials/user-table";
import { AssignRoleDialog } from "./partials/assign-role-dialog";
import { RemoveRoleAlert } from "./partials/remove-role-alert";
import { DeleteUserAlert } from "./partials/delete-user-alert";
import type { User, Role } from "./partials/types";
import { IconClock } from "@tabler/icons-react";

export default function KelolaUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");
  const hasFetched = useRef(false);

  // Assign role dialog
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Remove role dialog
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<{
    userId: string;
    roleId: string;
    roleName: string;
    userName: string;
  } | null>(null);

  // Delete user dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
      ]);

      if (!usersRes.ok || !rolesRes.ok) throw new Error("Failed to fetch");

      const [usersData, rolesData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
      ]);

      setUsers(usersData);
      setRoles(rolesData);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Gagal memuat data user");
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleId) {
      toast.error("Pilih role terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: selectedRoleId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal assign role");
      }

      toast.success("Role berhasil di-assign");
      setAssignDialogOpen(false);
      setSelectedUser(null);
      setSelectedRoleId("");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal assign role");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveRole = async () => {
    if (!roleToRemove) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/users/${roleToRemove.userId}/role?roleId=${roleToRemove.roleId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus role");
      }

      toast.success("Role berhasil dihapus");
      setRemoveDialogOpen(false);
      setRoleToRemove(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus role");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus user");
      }

      toast.success("User berhasil dihapus");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus user");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    if (filter === "verified") {
      return matchSearch && user.roles.length > 0;
    } else if (filter === "pending") {
      return matchSearch && user.roles.length === 0;
    }
    return matchSearch;
  });

  const pendingCount = users.filter((u) => u.roles.length === 0).length;
  const verifiedCount = users.filter((u) => u.roles.length > 0).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Kelola User</h1>
          <p className="text-muted-foreground">
            Manajemen user dan assign role
          </p>
        </div>
        <UserTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola User</h1>
        <p className="text-muted-foreground">Manajemen user dan assign role</p>
      </div>

      {pendingCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
          <div className="flex items-center gap-3">
            <IconClock className="size-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {pendingCount} user menunggu verifikasi
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Assign role untuk mengaktifkan akun mereka
              </p>
            </div>
          </div>
        </div>
      )}

      <UserFilters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        counts={{
          all: users.length,
          verified: verifiedCount,
          pending: pendingCount,
        }}
      />

      <UserTable
        users={filteredUsers}
        onAssignRole={(user) => {
          setSelectedUser(user);
          setAssignDialogOpen(true);
        }}
        onRemoveRole={(user, roleId, roleName) => {
          setRoleToRemove({
            userId: user.id,
            roleId,
            roleName,
            userName: user.name,
          });
          setRemoveDialogOpen(true);
        }}
        onDeleteUser={(user) => {
          setUserToDelete(user);
          setDeleteDialogOpen(true);
        }}
      />

      <AssignRoleDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        user={selectedUser}
        roles={roles}
        selectedRoleId={selectedRoleId}
        onRoleSelect={setSelectedRoleId}
        onSubmit={handleAssignRole}
        submitting={submitting}
      />

      <RemoveRoleAlert
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        data={roleToRemove}
        onConfirm={handleRemoveRole}
        submitting={submitting}
      />

      <DeleteUserAlert
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userName={userToDelete?.name || null}
        onConfirm={handleDeleteUser}
        submitting={submitting}
      />
    </div>
  );
}
