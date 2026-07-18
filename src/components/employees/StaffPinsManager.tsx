import React, { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, Plus, Power, ShieldAlert, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// staff_members is maintained by the Order Manager project and is not in this
// generated Management Hub Database type yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb = supabase as any;

const STAFF_ROLES = ["bartender", "server", "manager", "admin"] as const;
const MANAGER_ROLES = new Set(["admin", "manager", "owner", "director"]);

interface StaffRow {
  id: string;
  tenant_id: string;
  name: string;
  email: string | null;
  role: string;
  pin_last_four: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface StaffPinsManagerProps {
  tenantId?: string;
  userRole?: string;
}

const normalizeRole = (role?: string) => (role ?? "").trim().toLowerCase();

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export const StaffPinsManager: React.FC<StaffPinsManagerProps> = ({
  tenantId,
  userRole,
}) => {
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [pinTarget, setPinTarget] = useState<StaffRow | null>(null);

  const normalizedRole = normalizeRole(userRole);
  const isExpectedManagerRole = !normalizedRole || MANAGER_ROLES.has(normalizedRole);

  const refresh = useCallback(async () => {
    if (!tenantId) {
      setRows([]);
      return;
    }

    setLoading(true);
    const { data, error } = await sb
      .from("staff_members")
      .select("id, tenant_id, name, email, role, pin_last_four, active, created_at, updated_at")
      .eq("tenant_id", tenantId)
      .order("active", { ascending: false })
      .order("name", { ascending: true });

    if (error) {
      toast.error("Could not load staff PINs", {
        description: error.message,
      });
      setRows([]);
    } else {
      setRows((data ?? []) as StaffRow[]);
    }

    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const activeCount = useMemo(() => rows.filter((row) => row.active).length, [rows]);

  const toggleActive = async (row: StaffRow) => {
    const { data, error } = await sb.functions.invoke("set-staff-pin", {
      body: {
        action: "update_staff",
        staff_member_id: row.id,
        updates: { active: !row.active },
      },
    });

    if (error || data?.error) {
      toast.error("Could not update staff access", {
        description: data?.error || error?.message || "Unknown error",
      });
      return;
    }

    toast.success(row.active ? "Staff member deactivated" : "Staff member activated", {
      description: `${row.name} is now ${row.active ? "inactive" : "active"}.`,
    });
    refresh();
  };

  return (
    <section className="bg-white rounded-xl border border-border/50 p-4 sm:p-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            Order Manager PIN access
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Staff PINs</h2>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Create and manage the staff PINs used to clock into Order Manager tablets.
            {activeCount ? ` ${activeCount} active.` : ""}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 w-full sm:w-auto"
          disabled={!tenantId}
        >
          <UserPlus className="w-4 h-4" />
          Add staff PIN
        </Button>
      </div>

      {!tenantId ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3 text-amber-900">
          <ShieldAlert className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">No tenant is configured for this account.</p>
            <p className="text-sm mt-1">Assign this user to a tenant before creating staff PINs.</p>
          </div>
        </div>
      ) : null}

      {!isExpectedManagerRole ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Your current role is <span className="font-semibold">{userRole}</span>. This tool is intended for managers,
          admins, owners, and directors. Backend permissions will enforce final access.
        </div>
      ) : null}

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Name</th>
                <th className="text-left p-4 font-medium text-sm">Role</th>
                <th className="text-left p-4 font-medium text-sm">Email</th>
                <th className="text-left p-4 font-medium text-sm">PIN</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Added</th>
                <th className="text-right p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <Loader2 className="inline w-5 h-5 animate-spin mr-2" />
                    Loading staff PINs…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No staff PINs yet. Add the first bartender or server to get started.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className={`border-b last:border-b-0 ${!row.active ? "opacity-60" : ""}`}>
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4 capitalize">{row.role}</td>
                    <td className="p-4 text-gray-600">{row.email || "—"}</td>
                    <td className="p-4 tabular-nums font-mono">
                      {row.pin_last_four ? `••${row.pin_last_four}` : "—"}
                    </td>
                    <td className="p-4">
                      {row.active ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{formatDate(row.created_at)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setPinTarget(row)} className="gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          Reset PIN
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleActive(row)}
                          className="gap-1.5"
                          title={row.active ? "Deactivate" : "Activate"}
                        >
                          <Power className="w-3.5 h-3.5" />
                          {row.active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <Loader2 className="inline w-5 h-5 animate-spin mr-2" />
              Loading staff PINs…
            </div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No staff PINs yet. Add the first bartender or server to get started.
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className={`p-4 space-y-3 ${!row.active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{row.name}</p>
                    <p className="text-sm text-gray-500">{row.email || "No email"}</p>
                  </div>
                  {row.active ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Role</p>
                    <p className="capitalize font-medium">{row.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">PIN</p>
                    <p className="font-mono tabular-nums">{row.pin_last_four ? `••${row.pin_last_four}` : "—"}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setPinTarget(row)} className="gap-1.5 flex-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    Reset PIN
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(row)} className="gap-1.5 flex-1">
                    <Power className="w-3.5 h-3.5" />
                    {row.active ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateStaffPinDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        tenantId={tenantId || ""}
        onCreated={refresh}
      />
      <SetStaffPinDialog
        open={!!pinTarget}
        onOpenChange={(open) => {
          if (!open) setPinTarget(null);
        }}
        target={pinTarget}
        onSaved={refresh}
      />
    </section>
  );
};

interface CreateStaffPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  onCreated: () => void;
}

const CreateStaffPinDialog: React.FC<CreateStaffPinDialogProps> = ({
  open,
  onOpenChange,
  tenantId,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("bartender");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setRole("bartender");
      setPin("");
      setConfirmPin("");
      setSaving(false);
    }
  }, [open]);

  const pinValid = /^\d{4,8}$/.test(pin);
  const pinsMatch = pin === confirmPin;
  const canSubmit = !!tenantId && !!name.trim() && pinValid && pinsMatch && !saving;

  const onSubmit = async () => {
    if (!canSubmit) return;

    setSaving(true);
    const { data, error } = await sb.functions.invoke("set-staff-pin", {
      body: {
        action: "create_staff",
        tenant_id: tenantId,
        name: name.trim(),
        email: email.trim() || null,
        role,
        pin,
      },
    });
    setSaving(false);

    if (error || data?.error) {
      toast.error("Could not add staff PIN", {
        description: data?.error || error?.message || "Unknown error",
      });
      return;
    }

    toast.success("Staff PIN added", {
      description: `${name.trim()} can now clock into Order Manager.`,
    });
    onCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add staff PIN</DialogTitle>
          <DialogDescription>
            Create an Order Manager PIN for a bartender, server, or manager.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="staff-pin-name">Name</Label>
            <Input
              id="staff-pin-name"
              placeholder="e.g. Maria Rodriguez"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-pin-email">Email (optional)</Label>
            <Input
              id="staff-pin-email"
              type="email"
              placeholder="maria@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-pin-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="staff-pin-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((staffRole) => (
                  <SelectItem key={staffRole} value={staffRole} className="capitalize">
                    {staffRole}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="staff-pin">PIN</Label>
              <Input
                id="staff-pin"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                placeholder="••••"
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
                className="tracking-widest text-center font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-pin-confirm">Confirm PIN</Label>
              <Input
                id="staff-pin-confirm"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                placeholder="••••"
                value={confirmPin}
                onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, ""))}
                className="tracking-widest text-center font-mono"
              />
            </div>
          </div>
          {pin && !pinValid ? <p className="text-xs text-red-600">PIN must be 4–8 digits.</p> : null}
          {pin && pinValid && confirmPin && !pinsMatch ? (
            <p className="text-xs text-red-600">PINs do not match.</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!canSubmit} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add staff PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SetStaffPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: StaffRow | null;
  onSaved: () => void;
}

const SetStaffPinDialog: React.FC<SetStaffPinDialogProps> = ({
  open,
  onOpenChange,
  target,
  onSaved,
}) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setPin("");
      setConfirmPin("");
      setSaving(false);
    }
  }, [open]);

  const pinValid = /^\d{4,8}$/.test(pin);
  const pinsMatch = pin === confirmPin;
  const canSubmit = !!target && pinValid && pinsMatch && !saving;

  const onSubmit = async () => {
    if (!canSubmit || !target) return;

    setSaving(true);
    const { data, error } = await sb.functions.invoke("set-staff-pin", {
      body: {
        action: "set_pin",
        staff_member_id: target.id,
        new_pin: pin,
      },
    });
    setSaving(false);

    if (error || data?.error) {
      toast.error("Could not reset PIN", {
        description: data?.error || error?.message || "Unknown error",
      });
      return;
    }

    toast.success("PIN reset", {
      description: `${target.name}'s Order Manager PIN was updated.`,
    });
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset PIN{target ? ` for ${target.name}` : ""}</DialogTitle>
          <DialogDescription>The new PIN takes effect immediately. The old PIN stops working.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="staff-new-pin">New PIN</Label>
            <Input
              id="staff-new-pin"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              placeholder="••••"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
              className="tracking-widest text-center font-mono text-lg"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-new-pin-confirm">Confirm new PIN</Label>
            <Input
              id="staff-new-pin-confirm"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              placeholder="••••"
              value={confirmPin}
              onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, ""))}
              className="tracking-widest text-center font-mono text-lg"
            />
          </div>
          {pin && !pinValid ? <p className="text-xs text-red-600">PIN must be 4–8 digits.</p> : null}
          {pin && pinValid && confirmPin && !pinsMatch ? (
            <p className="text-xs text-red-600">PINs do not match.</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!canSubmit} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            Reset PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffPinsManager;
