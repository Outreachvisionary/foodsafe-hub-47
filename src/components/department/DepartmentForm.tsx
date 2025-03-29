
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import OrganizationSelector from '@/components/organizations/OrganizationSelector';
import FacilitySelector from '@/components/facilities/FacilitySelector';
import { createDepartment, updateDepartment } from '@/services/departmentService';
import { Department } from '@/types/department';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DepartmentFormProps {
  department?: Department;
  organizationId?: string; 
  facilityId?: string;
  onSuccess?: (department: Department) => void;
  onSave?: (department: Department) => void;
  onCancel?: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  organizationId: initialOrgId,
  facilityId: initialFacilityId,
  onSave,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(department?.name || '');
  const [description, setDescription] = useState(department?.description || '');
  const [organizationId, setOrganizationId] = useState(initialOrgId || department?.organization_id || '');
  const [facilityId, setFacilityId] = useState(initialFacilityId || department?.facility_id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Department name is required';
    }
    
    if (!organizationId) {
      newErrors.organizationId = 'Organization is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
        let savedDepartment;
        if (department?.id) {
            savedDepartment = await updateDepartment(department.id, { 
                name, 
                description, 
                organization_id: organizationId, 
                facility_id: facilityId || null 
            });
            toast.success('Department updated successfully');
        } else {
            savedDepartment = await createDepartment({ 
                name, 
                description, 
                organization_id: organizationId, 
                facility_id: facilityId || null 
            });
            toast.success('Department created successfully');
        }
        if (onSave) onSave(savedDepartment);
        if (onSuccess) onSuccess(savedDepartment);
    } catch (error) {
        console.error('Error saving department:', error);
        toast.error('Failed to save department. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!organizationId && !initialOrgId && !department?.organization_id) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground mb-4">
          Please select an organization first before creating a department.
        </p>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-foreground mb-1">
          Organization
        </label>
        <OrganizationSelector
          value={organizationId}
          onChange={setOrganizationId}
          className={errors.organizationId ? 'border-destructive' : ''}
        />
        {errors.organizationId && (
          <p className="text-sm text-destructive mt-1">{errors.organizationId}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="facility" className="block text-sm font-medium text-foreground mb-1">
          Facility (Optional)
        </label>
        <FacilitySelector
          organizationId={organizationId}
          value={facilityId}
          onChange={setFacilityId}
          className={errors.facilityId ? 'border-destructive' : ''}
        />
        {errors.facilityId && (
          <p className="text-sm text-destructive mt-1">{errors.facilityId}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Department Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" /> 
              {department?.id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            department?.id ? 'Update Department' : 'Create Department'
          )}
        </Button>
      </div>
    </form>
  );
};

export default DepartmentForm;
