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
      // Query tenant_members joined with profiles for the current tenant
      const { data, error } = await supabase
        .from('tenant_members')
        .select(`
          id,
          role,
          is_active,
          user_id,
          profiles:user_id (
            id,
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Could not load tenant members:', error.message);
        setUsers([]);
        return;
      }

      if (data) {
        const mapped: TeamUser[] = data.map((m: any) => ({
          id: m.id,
          name: m.profiles?.full_name || 'Unknown',
          email: m.profiles?.email || '',
          role: m.role || 'staff',
          status: m.is_active ? 'Active' : 'Inactive',
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
  }, [currentDestination]);

  const onInvite = async () => {
    if (!inviteEmail) {
      toast({ variant: 'destructive', title: 'Email required', description: 'Please enter an email address.' });
      return;
    }

    setInviting(true);
    try {
      // Check if profile exists for this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', inviteEmail)
        .single();

      let profileId: string;

      if (existingProfile) {
        profileId = existingProfile.id;
      } else {
        // Create a profile entry for the invited user
        const newId = crypto.randomUUID();
        const { error: profileErr } = await supabase
          .from('profiles')
          .insert({
            id: newId,
            email: inviteEmail,
            full_name: inviteName || inviteEmail.split('@')[0],
          });

        if (profileErr) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not create user profile.' });
          return;
        }
        profileId = newId;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('tenant_members')
        .select('id')
        .eq('user_id', profileId)
        .single();

      if (existingMember) {
        toast({ variant: 'destructive', title: 'Already a member', description: 'This user is already on the team.' });
        return;
      }

      // Insert tenant member
      const { error: memberErr } = await supabase
        .from('tenant_members')
        .insert({
          user_id: profileId,
          role: inviteRole,
          is_active: true,
        });

      if (memberErr) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add team member: ' + memberErr.message });
        return;
      }

      toast({
        variant: 'success',
        title: 'User added',
        description: `${inviteName || inviteEmail} added as ${inviteRole}.`,
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
        .from('tenant_members')
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
