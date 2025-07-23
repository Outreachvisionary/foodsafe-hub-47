import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/enhanced-loading';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchAuditById, updateAudit, type Audit } from '@/services/realAuditService';
import { toast } from 'sonner';
import DashboardHeader from '@/components/DashboardHeader';

const auditEditSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  audit_type: z.string().min(1, 'Audit type is required'),
  status: z.string().min(1, 'Status is required'),
  assigned_to: z.string().min(1, 'Assigned to is required'),
  start_date: z.string().min(1, 'Start date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  department: z.string().optional(),
  location: z.string().optional(),
  related_standard: z.string().optional(),
});

type AuditEditValues = z.infer<typeof auditEditSchema>;

const AuditEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AuditEditValues>({
    resolver: zodResolver(auditEditSchema),
    defaultValues: {
      title: '',
      description: '',
      audit_type: '',
      status: '',
      assigned_to: '',
      start_date: '',
      due_date: '',
      department: '',
      location: '',
      related_standard: '',
    },
  });

  useEffect(() => {
    if (id) {
      loadAudit(id);
    }
  }, [id]);

  const loadAudit = async (auditId: string) => {
    try {
      setLoading(true);
      const audit = await fetchAuditById(auditId);
      
      if (!audit) {
        setError('Audit not found');
        return;
      }

      // Format dates for input fields
      const startDate = new Date(audit.start_date).toISOString().split('T')[0];
      const dueDate = new Date(audit.due_date).toISOString().split('T')[0];

      form.reset({
        title: audit.title,
        description: audit.description || '',
        audit_type: audit.audit_type,
        status: audit.status,
        assigned_to: audit.assigned_to,
        start_date: startDate,
        due_date: dueDate,
        department: audit.department || '',
        location: audit.location || '',
        related_standard: audit.related_standard || '',
      });
    } catch (err) {
      setError('Failed to load audit');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: AuditEditValues) => {
    if (!id) return;

    try {
      setSubmitting(true);
      
      const updateData: Partial<Audit> = {
        title: values.title,
        description: values.description,
        audit_type: values.audit_type,
        status: values.status,
        assigned_to: values.assigned_to,
        start_date: new Date(values.start_date).toISOString(),
        due_date: new Date(values.due_date).toISOString(),
        department: values.department,
        location: values.location,
        related_standard: values.related_standard,
      };

      await updateAudit(id, updateData);
      toast.success('Audit updated successfully');
      navigate(`/audits/${id}`);
    } catch (err) {
      console.error('Error updating audit:', err);
      toast.error('Failed to update audit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader title="Edit Audit" subtitle="Loading audit information..." />
        <LoadingState isLoading={true}>
          <div></div>
        </LoadingState>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader title="Edit Audit" subtitle="Error loading audit" />
        <div className="container max-w-4xl mx-auto py-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => navigate('/audits')}>
                Back to Audits
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Edit Audit" subtitle="Update audit information" />
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate(`/audits/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Audit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Audit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Audit Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter audit title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audit_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audit Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audit type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Internal">Internal Audit</SelectItem>
                            <SelectItem value="External">External Audit</SelectItem>
                            <SelectItem value="Supplier">Supplier Audit</SelectItem>
                            <SelectItem value="Regulatory">Regulatory Inspection</SelectItem>
                            <SelectItem value="Gap Analysis">Gap Assessment</SelectItem>
                            <SelectItem value="Compliance">Compliance Audit</SelectItem>
                            <SelectItem value="Follow-up">Follow-up Audit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assigned_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter auditor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Main Production Facility">Main Production Facility</SelectItem>
                            <SelectItem value="Warehouse Facility">Warehouse Facility</SelectItem>
                            <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                            <SelectItem value="Corporate Office">Corporate Office</SelectItem>
                            <SelectItem value="Supplier Facility">Supplier Facility</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                            <SelectItem value="Warehouse & Logistics">Warehouse & Logistics</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Sanitation">Sanitation</SelectItem>
                            <SelectItem value="Procurement">Procurement</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="R&D">R&D</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="related_standard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Standard</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select standard" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ISO 22000:2018">ISO 22000:2018</SelectItem>
                            <SelectItem value="FSSC 22000">FSSC 22000</SelectItem>
                            <SelectItem value="BRCGS Food Safety">BRCGS Food Safety</SelectItem>
                            <SelectItem value="SQF Edition 9">SQF Edition 9</SelectItem>
                            <SelectItem value="IFS Food">IFS Food</SelectItem>
                            <SelectItem value="HACCP">HACCP</SelectItem>
                            <SelectItem value="GMP">GMP</SelectItem>
                            <SelectItem value="Regulatory Requirements">Regulatory Requirements</SelectItem>
                            <SelectItem value="Internal Standards">Internal Standards</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter audit description and objectives" 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/audits/${id}`)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Audit
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AuditEditPage;