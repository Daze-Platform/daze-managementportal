import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStores } from '@/contexts/StoresContext';
import { useResort } from '@/contexts/DestinationContext';
import { Employee } from '@/contexts/EmployeesContext';

interface UserEditFormProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => Promise<void>;
}

export const UserEditForm = ({ employee, isOpen, onClose, onSave }: UserEditFormProps) => {
  const { stores } = useStores();
  const { resorts } = useResort();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Director',
    store: '',
    assignedStores: [] as string[],
    assignedResorts: [] as string[],
    status: 'Active',
    avatar: '/placeholder.svg'
  });

  // Load employee data when employee prop changes
  useEffect(() => {
    if (employee) {
      const nameParts = employee.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: employee.email,
        role: employee.role,
        store: employee.store || '',
        assignedStores: employee.assigned_stores || [],
        assignedResorts: employee.assigned_resorts || [],
        status: employee.status,
        avatar: employee.avatar || '/placeholder.svg'
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEmployee: Employee = {
      ...employee,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
      store: formData.store,
      assigned_stores: formData.assignedStores,
      assigned_resorts: formData.assignedResorts,
      status: formData.status,
      avatar: formData.avatar
    };

    await onSave(updatedEmployee);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Director">💼 Director</SelectItem>
                <SelectItem value="Admin">🔐 Admin</SelectItem>
                <SelectItem value="Manager">👔 Manager</SelectItem>
                <SelectItem value="Operator">⚙️ Operator</SelectItem>
                <SelectItem value="Runner">🚀 Runner</SelectItem>
                <SelectItem value="Server">🍽️ Server</SelectItem>
                <SelectItem value="Bartender">🍸 Bartender</SelectItem>
                <SelectItem value="Room Service">🛎️ Room Service</SelectItem>
                <SelectItem value="Kitchen Staff">👨‍🍳 Kitchen Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assigned Venues</Label>
            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-store-${store.id}`}
                    checked={formData.assignedStores.includes(store.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ 
                          ...formData, 
                          assignedStores: [...formData.assignedStores, store.name] 
                        });
                      } else {
                        setFormData({ 
                          ...formData, 
                          assignedStores: formData.assignedStores.filter(s => s !== store.name) 
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`edit-store-${store.id}`} className="text-sm font-normal">{store.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Assigned Resorts</Label>
            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
              {resorts.map((resort) => (
                <div key={resort.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-resort-${resort.id}`}
                    checked={formData.assignedResorts.includes(resort.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ 
                          ...formData, 
                          assignedResorts: [...formData.assignedResorts, resort.id] 
                        });
                      } else {
                        setFormData({ 
                          ...formData, 
                          assignedResorts: formData.assignedResorts.filter(r => r !== resort.id) 
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`edit-resort-${resort.id}`} className="text-sm font-normal">{resort.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};