import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserCreateForm } from '@/components/employees/UserCreateForm';
import { UserEditForm } from '@/components/employees/UserEditForm';
import { Plus, Search, User, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEmployees, Employee } from '@/contexts/EmployeesContext';
import ResortBadges from '@/components/employees/ResortBadges';
import StoreBadges from '@/components/employees/StoreBadges';

export const Employees = () => {
  const { 
    employees, 
    loading, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [deletingUser, setDeletingUser] = useState<Employee | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Helper functions
  const getStatusBadge = (status: string) => {
    const variant = status === 'Active' ? 'default' : status === 'Pending' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{status}</Badge>;
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateUser = async (userData: any) => {
    await addEmployee({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      store: userData.store,
      assigned_stores: userData.assigned_stores || [],
      assigned_resorts: userData.assigned_resorts || [],
      status: userData.status || 'Active',
      avatar: userData.avatar || '/placeholder.svg'
    });
  };

  const handleSaveUser = async (updatedUser: Employee) => {
    await updateEmployee(updatedUser);
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleEditUser = (employee: Employee) => {
    setEditingUser(employee);
    setIsEditDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (employee: Employee) => {
    setDeletingUser(employee);
  };

  const confirmDeleteUser = async () => {
    if (deletingUser) {
      await deleteEmployee(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const cancelDelete = () => {
    setDeletingUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Employees</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your team members and their access</p>
            </div>
            <Button 
              onClick={() => setIsCreateFormOpen(true)} 
              className="flex items-center gap-2 w-full sm:w-auto"
              size="default"
            >
              <Plus className="w-4 h-4" />
              Create User
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-full sm:max-w-sm"
            />
          </div>
        </div>

        {/* Mobile Employee Cards */}
        <div className="bg-white rounded-lg shadow-sm p-4 block sm:hidden">
          <div className="space-y-3">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="border border-gray-200 rounded-lg p-4 space-y-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md ring-1 ring-black/5">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 text-base truncate">{employee.name}</div>
                      <div className="text-sm text-gray-500 truncate">{employee.email}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => handleEditUser(employee)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteUser(employee)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">{employee.role}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Stores</div>
                    <StoreBadges stores={employee.assigned_stores} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Resorts</div>
                    <ResortBadges resorts={employee.assigned_resorts} />
                  </div>
                  
                  <div className="pt-2">
                    {getStatusBadge(employee.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 hidden sm:block">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium">Employee</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Stores</th>
                <th className="text-left p-4 font-medium">Resorts</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b last:border-b-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-semibold shadow-md ring-1 ring-black/5">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant="outline">{employee.role}</Badge></td>
                  <td className="p-4">
                    <StoreBadges stores={employee.assigned_stores} />
                  </td>
                  <td className="p-4">
                    <ResortBadges resorts={employee.assigned_resorts} />
                  </td>
                  <td className="p-4">{getStatusBadge(employee.status)}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(employee)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(employee)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'No employees match your search criteria.' : 'Get started by creating your first employee.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create User
          </Button>
        )}
            </div>
          </div>
        )}

        <UserCreateForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSubmit={handleCreateUser}
      />

      {editingUser && (
        <UserEditForm
          isOpen={isEditDialogOpen}
          onClose={handleCancelEdit}
          onSave={handleSaveUser}
          employee={editingUser}
        />
        )}

        <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Employee</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deletingUser?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};