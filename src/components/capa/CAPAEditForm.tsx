import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CAPA, UpdateCAPARequest } from '@/types/capa';
import { CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating } from '@/types/enums';
import { toast } from 'sonner';

interface CAPAEditFormProps {
  capa: CAPA;
  onSave: (updates: UpdateCAPARequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CAPAEditForm: React.FC<CAPAEditFormProps> = ({ capa, onSave, onCancel, loading = false }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UpdateCAPARequest>({
    defaultValues: {
      title: capa.title,
      description: capa.description,
      status: capa.status,
      priority: capa.priority,
      assigned_to: capa.assigned_to,
      due_date: capa.due_date,
      root_cause: capa.root_cause || '',
      corrective_action: capa.corrective_action || '',
      preventive_action: capa.preventive_action || '',
      effectiveness_criteria: capa.effectiveness_criteria || '',
      department: capa.department || '',
      effectiveness_verified: capa.effectiveness_verified || false,
      effectiveness_rating: capa.effectiveness_rating,
      verification_date: capa.verification_date || '',
      verification_method: capa.verification_method || '',
      verified_by: capa.verified_by || ''
    }
  });

  const [selectedStatus, setSelectedStatus] = useState<CAPAStatus>(capa.status);
  const [selectedPriority, setSelectedPriority] = useState<CAPAPriority>(capa.priority);
  const [selectedRating, setSelectedRating] = useState<CAPAEffectivenessRating | undefined>(capa.effectiveness_rating);

  const onSubmit = async (data: UpdateCAPARequest) => {
    try {
      await onSave({
        ...data,
        status: selectedStatus,
        priority: selectedPriority,
        effectiveness_rating: selectedRating
      });
      toast.success('CAPA updated successfully');
    } catch (error) {
      console.error('Failed to update CAPA:', error);
      toast.error('Failed to update CAPA');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Edit the basic CAPA details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={(value: CAPAStatus) => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CAPAStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={selectedPriority} onValueChange={(value: CAPAPriority) => setSelectedPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CAPAPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input
                id="assigned_to"
                {...register('assigned_to')}
              />
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register('department')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Root Cause & Actions</CardTitle>
          <CardDescription>Define the root cause and corrective/preventive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="root_cause">Root Cause</Label>
            <Textarea
              id="root_cause"
              {...register('root_cause')}
              rows={3}
              placeholder="Describe the root cause analysis..."
            />
          </div>

          <div>
            <Label htmlFor="corrective_action">Corrective Action</Label>
            <Textarea
              id="corrective_action"
              {...register('corrective_action')}
              rows={3}
              placeholder="Describe the corrective actions taken..."
            />
          </div>

          <div>
            <Label htmlFor="preventive_action">Preventive Action</Label>
            <Textarea
              id="preventive_action"
              {...register('preventive_action')}
              rows={3}
              placeholder="Describe the preventive actions to avoid recurrence..."
            />
          </div>

          <div>
            <Label htmlFor="effectiveness_criteria">Effectiveness Criteria</Label>
            <Textarea
              id="effectiveness_criteria"
              {...register('effectiveness_criteria')}
              rows={2}
              placeholder="Define how effectiveness will be measured..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Effectiveness Verification</CardTitle>
          <CardDescription>Track the effectiveness of implemented actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="effectiveness_verified"
              checked={watch('effectiveness_verified')}
              onCheckedChange={(checked) => setValue('effectiveness_verified', checked)}
            />
            <Label htmlFor="effectiveness_verified">Effectiveness Verified</Label>
          </div>

          {watch('effectiveness_verified') && (
            <>
              <div>
                <Label>Effectiveness Rating</Label>
                <Select 
                  value={selectedRating || ''} 
                  onValueChange={(value: CAPAEffectivenessRating) => setSelectedRating(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CAPAEffectivenessRating).map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="verification_date">Verification Date</Label>
                  <Input
                    id="verification_date"
                    type="date"
                    {...register('verification_date')}
                  />
                </div>

                <div>
                  <Label htmlFor="verified_by">Verified By</Label>
                  <Input
                    id="verified_by"
                    {...register('verified_by')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="verification_method">Verification Method</Label>
                <Textarea
                  id="verification_method"
                  {...register('verification_method')}
                  rows={2}
                  placeholder="Describe the verification method used..."
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default CAPAEditForm;