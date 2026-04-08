import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  store?: string;
  assigned_stores?: string[];
  assigned_resorts?: string[];
  status: string;
  avatar?: string;
  resort_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface EmployeesContextType {
  employees: Employee[];
  loading: boolean;
  addEmployee: (
    employee: Omit<Employee, "id" | "created_at" | "updated_at">,
    tenantId?: string,
  ) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  refreshEmployees: () => Promise<void>;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(
  undefined,
);

export const EmployeesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userProfile } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async (tenantId: string, showErrors = false) => {
    try {
      setLoading(true);

      if (!tenantId) {
        setEmployees([]);
        setLoading(false);
        return;
      }

      // Scope to this tenant's resorts
      const { data: resortRows } = await supabase
        .from("resorts")
        .select("id")
        .eq("tenant_id", tenantId);
      const resortIds = resortRows?.map((r) => r.id) ?? [];

      const query = supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });
      const { data, error } = resortIds.length > 0
        ? await query.in("resort_id", resortIds)
        : await query.eq("resort_id", "no-match");

      if (error) {
        console.warn("Could not load employees:", error.message);
        if (showErrors) {
          toast.error("Failed to load employees");
        }
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.warn("Network error loading employees:", error);
      if (showErrors) {
        toast.error("Failed to load employees");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshEmployees = async () => {
    if (userProfile?.tenantId) await loadEmployees(userProfile.tenantId, true);
  };

  const addEmployee = async (
    employeeData: Omit<Employee, "id" | "created_at" | "updated_at">,
    tenantId?: string,
  ) => {
    // Create optimistic employee with temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticEmployee: Employee = {
      ...employeeData,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to local state immediately (optimistic update)
    setEmployees((prev) => [optimisticEmployee, ...prev]);
    toast.success("Employee added successfully");

    try {
      const { data, error } = await supabase
        .from("employees")
        .insert([employeeData])
        .select()
        .single();

      if (error) {
        console.warn("Could not sync employee to database:", error.message);
        // Keep the local version - it's still usable
        return;
      }

      // Replace temp ID with real ID from database
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === tempId ? data : emp)),
      );

      // Send invite email if tenantId provided
      if (tenantId) {
        try {
          const { data: inviteData, error: inviteError } = await supabase.functions.invoke("invite-employee", {
            body: {
              email: employeeData.email,
              name: employeeData.name,
              role: employeeData.role,
              tenantId,
            },
          });
          if (inviteError || inviteData?.error) {
            const msg = inviteData?.error || inviteError?.message || "Unknown error";
            if (msg.includes("already been registered")) {
              toast.info(employeeData.email + " already has an account — no invite needed.");
            } else {
              toast.error("Invite failed: " + msg);
            }
          } else {
            toast.success("Invite sent to " + employeeData.email);
          }
        } catch (inviteErr: any) {
          toast.error("Could not send invite: " + (inviteErr?.message || "Unknown error"));
        }
      }
    } catch (error) {
      console.warn("Network error syncing employee:", error);
      // Keep the local version
    }
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    // Optimistic update
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp,
      ),
    );
    toast.success("Employee updated successfully");

    try {
      const { error } = await supabase
        .from("employees")
        .update({
          name: updatedEmployee.name,
          email: updatedEmployee.email,
          role: updatedEmployee.role,
          store: updatedEmployee.store,
          assigned_stores: updatedEmployee.assigned_stores,
          assigned_resorts: updatedEmployee.assigned_resorts,
          status: updatedEmployee.status,
          avatar: updatedEmployee.avatar,
          resort_id: updatedEmployee.resort_id,
        })
        .eq("id", updatedEmployee.id);

      if (error) {
        console.warn("Could not sync employee update:", error.message);
      }
    } catch (error) {
      console.warn("Network error syncing employee update:", error);
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    // Optimistic delete
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    toast.success("Employee deleted successfully");

    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", employeeId);

      if (error) {
        console.warn("Could not sync employee deletion:", error.message);
      }
    } catch (error) {
      console.warn("Network error syncing employee deletion:", error);
    }
  };

  useEffect(() => {
    if (userProfile?.tenantId) {
      loadEmployees(userProfile.tenantId);
    } else {
      setLoading(false);
    }
  }, [userProfile?.tenantId]);

  const value: EmployeesContextType = {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees,
  };

  return (
    <EmployeesContext.Provider value={value}>
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = (): EmployeesContextType => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeesProvider");
  }
  return context;
};
