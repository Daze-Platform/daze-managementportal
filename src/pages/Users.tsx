import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDestination } from '@/contexts/DestinationContext';
import { useAuth } from '@/contexts/AuthContext';

type TeamUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  userId: string;
};

export const Users = () => {
  const { toast } = useToast();
  const { currentDestination } = useDestination();
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('staff');
  const [inviting, setInviting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Query user_tenants joined with profiles for the current tenant
      const tenantId = userProfile?.tenantId;
      if (!tenantId) {
        setUsers([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          id,
          role,
          user_id,
          tenant_id,
          profiles:user_id (
            id,
            email,
            full_name
          )
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Could not load tenant members:', error.message);
        setUsers([]);
        return;
      }

      if (data) {
        const mapped: TeamUser[] = data.map((m: any) => ({
          id: m.id,
          name: m.profiles?.full_name || 'User',
          email: m.profiles?.email || '',
          role: m.role || 'staff',
          status: 'Active',
          userId: m.user_id,
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentDestination, userProfile?.tenantId]);

  const onInvite = async () => {
    if (!inviteEmail) {
      toast({ variant: 'destructive', title: 'Email required', description: 'Please enter an email address.' });
      return;
    }

    setInviting(true);
    try {
      const tenantId = userProfile?.tenantId;
      if (!tenantId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not determine tenant.' });
        return;
      }

      // Call the invite-employee edge function to properly handle invitations
      const { data: inviteData, error: inviteError } = await supabase.functions.invoke('invite-employee', {
        body: {
          email: inviteEmail,
          name: inviteName,
          role: inviteRole,
          tenantId,
        },
      });

      if (inviteError) {
        const errorMsg = inviteError.message || 'Unknown error';
        if (errorMsg.includes('already been registered') || errorMsg.includes('already')) {
          toast({
            variant: 'info',
            title: 'User already has account',
            description: inviteEmail + ' already has an account — adding to team directly.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Invite failed',
            description: errorMsg,
          });
          return;
        }
      }

      if (inviteData?.error) {
        const errorMsg = inviteData.error || 'Unknown error';
        if (errorMsg.includes('already been registered') || errorMsg.includes('already')) {
          toast({
            variant: 'info',
            title: 'User already has account',
            description: inviteEmail + ' already has an account — adding to team directly.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Invite failed',
            description: errorMsg,
          });
          return;
        }
      }

      toast({
        variant: 'success',
        title: 'Invitation sent',
        description: `Invite sent to ${inviteEmail}.`,
      });

      setInviteEmail('');
      setInviteName('');
      setInviteRole('staff');
      setOpen(false);
      loadUsers();
    } catch (err) {
      console.error('Invite error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to invite user.' });
    } finally {
      setInviting(false);
    }
  };

  const onRemoveUser = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('user_tenants')
        .delete()
        .eq('id', memberId);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not remove user.' });
        return;
      }

      toast({ variant: 'success', title: 'User removed' });
      loadUsers();
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Team Users</h1>
            <p className="text-sm text-gray-600 mt-1">Manage team access and permissions.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Add a user with role-based access.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Jay Culham"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onInvite} disabled={inviting}>
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No team members yet. Click "Add User" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => onRemoveUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};
