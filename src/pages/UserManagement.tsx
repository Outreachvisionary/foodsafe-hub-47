import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { UserProfile } from '@/types/user';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus, Copy, Check, User, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { DepartmentSelector } from '@/components/department/DepartmentSelector';
import { Organization } from '@/types/organization';
import { fetchOrganizations } from '@/services/organizationService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Facility } from '@/types/facility';
import { fetchFacilities } from '@/services/facilityService';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { StatusSelect } from '@/components/ui/StatusSelect';
import { useToast } from '@/components/ui/use-toast';

interface UserManagementProps {
  // Define any props here
}

const UserManagement: React.FC<UserManagementProps> = ({ /* props */ }) => {
  const { user, profile, updateProfile } = useUser();
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<"active" | "inactive" | "pending">("active");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string | undefined>(undefined);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for demonstration
    const mockUserProfiles: UserProfile[] = [
      {
        id: '1',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        department: 'IT',
        status: 'active',
        organization_id: 'org1',
      },
      {
        id: '2',
        full_name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Manager',
        department: 'HR',
        status: 'active',
        organization_id: 'org1',
      },
      {
        id: '3',
        full_name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        role: 'Employee',
        department: 'Marketing',
        status: 'inactive',
        organization_id: 'org2',
      },
    ];
    setUserProfiles(mockUserProfiles);

    // Mock organizations
    const mockOrganizations: Organization[] = [
      { id: 'org1', name: 'Acme Corp' },
      { id: 'org2', name: 'Beta Inc' },
    ];
    setOrganizations(mockOrganizations);

    // Mock facilities
    const mockFacilities: Facility[] = [
      { id: 'fac1', name: 'Main Facility', organization_id: 'org1' },
      { id: 'fac2', name: 'Branch Office', organization_id: 'org2' },
    ];
    setFacilities(mockFacilities);
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      setFullName(selectedProfile.full_name || '');
      setEmail(selectedProfile.email || '');
      setRole(selectedProfile.role || '');
      setDepartment(selectedProfile.department || '');
      setStatus(selectedProfile.status as "active" | "inactive" | "pending" || "active");
    }
  }, [selectedProfile]);

  const handleCopyEmail = (emailToCopy: string) => {
    navigator.clipboard.writeText(emailToCopy);
    toast({
      title: "Email copied!",
      description: `Email ${emailToCopy} copied to clipboard.`,
    })
  };

  const handleOrganizationChange = (orgId: string) => {
    setSelectedOrganization(orgId);
    setSelectedFacility(undefined); // Reset facility when organization changes
  };

  const handleFacilityChange = (facilityId: string) => {
    setSelectedFacility(facilityId);
  };

  const handleEditProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
    setIsEditing(true);
  };

  const handleViewProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedProfile(null);
  };

  const updateUserProfileDepartment = (profile: UserProfile, department: string) => {
    if (!profile) return profile;
    
    return {
      ...profile,
      department: department // Use department, not department_id
    };
  };

  const handleDepartmentChange = (profile: UserProfile, departmentValue: string) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      department: departmentValue // Use department, not department_id
    };
    
    setSelectedProfile(updatedProfile);
    setDepartment(departmentValue);
  };

  const handleSaveProfile = async () => {
    if (!selectedProfile) return;

    try {
      setLoading(true);
      const updatedProfile: UserProfile = {
        ...selectedProfile,
        full_name: fullName,
        email: email,
        role: role,
        department: department,
        status: status,
      };

      setUserProfiles(prevProfiles =>
        prevProfiles.map(p => (p.id === selectedProfile.id ? updatedProfile : p))
      );

      setSelectedProfile(updatedProfile);

      toast({
        title: "Profile updated!",
        description: `Profile for ${fullName} has been updated.`,
      })
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "Failed to update the profile. Please try again.",
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="mb-4 flex items-center space-x-4">
        <Select onValueChange={handleOrganizationChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleFacilityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Facility" />
          </SelectTrigger>
          <SelectContent>
            {facilities
              .filter(facility => selectedOrganization ? facility.organization_id === selectedOrganization : true)
              .map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>{facility.name}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of your user profiles.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userProfiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.full_name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {profile.email}
                    <Button variant="ghost" size="icon" onClick={() => handleCopyEmail(profile.email || '')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{profile.role}</TableCell>
                <TableCell>{profile.department}</TableCell>
                <TableCell>{profile.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(profile)}>
                    <User className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleEditProfile(profile)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit User Profile" : "View User Profile"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the user profile here. Click save when you're done."
                : "View user profile information."}
            </DialogDescription>
          </DialogHeader>
          {selectedProfile && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={fullName}
                  disabled={!isEditing}
                  onChange={(e) => setFullName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  disabled={!isEditing}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <RoleSelector
                    value={role}
                    onChange={setRole}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <div className="col-span-3">
                  <DepartmentSelector
                    organizationId={selectedOrganization}
                    facilityId={selectedFacility}
                    value={department}
                    onChange={(value) => {
                      if (selectedProfile) {
                        handleDepartmentChange(selectedProfile, value);
                      }
                    }}
                    placeholder="Select department..."
                    className="w-full"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <StatusSelect
                    status={status}
                    onStatusChange={setStatus}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </DialogClose>
            {isEditing && (
              <Button type="submit" onClick={handleSaveProfile} disabled={loading}>
                {loading ? (
                  <>
                    Saving...
                    <svg className="animate-spin ml-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 4V2m0 16v2m8-8h2M4 12H2M17.66 6.34l1.42-1.42M6.34 17.66l-1.42 1.42M17.66 17.66l1.42 1.42M6.34 6.34l-1.42-1.42"></path>
                    </svg>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
