import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updateNonConformance } from '@/services/nonConformanceService';
import { 
  NonConformance, 
  NCItemCategory, 
  NCReasonCategory,
  NCStatus 
} from '@/types/non-conformance';

interface NCDetailsFormProps {
  data: NonConformance;
  onSave: (updatedData: Partial<NonConformance>) => void;
}

const NCDetailsForm: React.FC<NCDetailsFormProps> = ({ data, onSave }) => {
  const [formData, setFormData] = useState<Partial<NonConformance>>(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Get the current user ID - in a real app, this would come from auth context
      const userId = data.created_by || 'system';
      
      // Call the update service
      await updateNonConformance(data.id, formData, userId);
      
      // Notify parent component
      onSave(formData);
      
      toast.success('Non-conformance details updated successfully');
    } catch (error) {
      console.error('Error updating non-conformance:', error);
      toast.error('Failed to update non-conformance details');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Use the valid values from the NCItemCategory type
  const itemCategories: NCItemCategory[] = [
    'Equipment',
    'Facility',
    'Finished Product',
    'Raw Material',
    'Packaging Material',
    'Personnel',
    'Other'
  ];
  
  // Use the valid values from the NCReasonCategory type
  const reasonCategories: NCReasonCategory[] = [
    'Quality Issue',
    'Process Deviation',
    'Foreign Material',
    'Other'
  ];
  
  const priorities = ['Critical', 'High', 'Medium', 'Low'];
  const riskLevels = ['high', 'moderate', 'low'];
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item_name">Item Name</Label>
                <Input
                  id="item_name"
                  name="item_name"
                  value={formData.item_name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item_category">Item Category</Label>
                <Select 
                  value={formData.item_category} 
                  onValueChange={(value) => handleSelectChange('item_category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason_category">Reason Category</Label>
                <Select 
                  value={formData.reason_category} 
                  onValueChange={(value) => handleSelectChange('reason_category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonCategories.map(reason => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority || ''} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="risk_level">Risk Level</Label>
                <Select 
                  value={formData.risk_level || ''} 
                  onValueChange={(value) => handleSelectChange('risk_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Details & Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity_on_hold">Quantity on Hold</Label>
                <Input
                  id="quantity_on_hold"
                  name="quantity_on_hold"
                  type="number"
                  value={formData.quantity_on_hold || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Input
                  id="units"
                  name="units"
                  value={formData.units || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Input
                  id="assigned_to"
                  name="assigned_to"
                  value={formData.assigned_to || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason_details">Reason Details</Label>
              <Textarea
                id="reason_details"
                name="reason_details"
                value={formData.reason_details || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resolution_details">Resolution Details</Label>
              <Textarea
                id="resolution_details"
                name="resolution_details"
                value={formData.resolution_details || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default NCDetailsForm;
