import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  store?: string; // Legacy single store field
  assigned_stores?: string[];
  assigned_resorts?: string[]; // New multiple resorts field
  status: string;
  avatar?: string;
  resort_id?: string; // Legacy single resort field
  created_at?: string;
  updated_at?: string;
}

interface EmployeesContextType {
  employees: Employee[];
  loading: boolean;
  addEmployee: (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  refreshEmployees: () => Promise<void>;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

export const EmployeesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading employees:', error);
        toast.error('Failed to load employees');
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const refreshEmployees = async () => {
    await loadEmployees();
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (error) {
        console.error('Error adding employee:', error);
        toast.error('Failed to add employee');
        return;
      }

      setEmployees(prev => [data, ...prev]);
      toast.success('Employee added successfully');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    try {
      const { data, error } = await supabase
        .from('employees')
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
        .eq('id', updatedEmployee.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating employee:', error);
        toast.error('Failed to update employee');
        return;
      }

      setEmployees(prev => 
        prev.map(emp => emp.id === updatedEmployee.id ? data : emp)
      );
      toast.success('Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
        return;
      }

      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

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
    throw new Error('useEmployees must be used within an EmployeesProvider');
  }
  return context;
};