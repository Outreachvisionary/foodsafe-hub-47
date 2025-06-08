
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { databaseService } from '@/services/databaseService';
import { CAPAPriority, CAPASource, ComplaintCategory } from '@/types/enums';

const DatabaseTestComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [capaForm, setCAPAForm] = useState({
    title: 'Test CAPA',
    description: 'Test CAPA description',
    priority: CAPAPriority.Medium,
    assigned_to: 'test-user',
    source: CAPASource.Internal_Report,
    due_date: new Date().toISOString().split('T')[0]
  });

  const [complaintForm, setComplaintForm] = useState({
    title: 'Test Complaint',
    description: 'Test complaint description',
    category: ComplaintCategory.Product_Quality
  });

  const testCAPACreation = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const isAuthenticated = await databaseService.checkAuth();
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const result = await databaseService.createCAPA(capaForm);
      setMessage({ type: 'success', text: `CAPA created successfully with ID: ${result.id}` });
    } catch (error) {
      setMessage({ type: 'error', text: `CAPA creation failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const testComplaintCreation = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const isAuthenticated = await databaseService.checkAuth();
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const result = await databaseService.createComplaint(complaintForm);
      setMessage({ type: 'success', text: `Complaint created successfully with ID: ${result.id}` });
    } catch (error) {
      setMessage({ type: 'error', text: `Complaint creation failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const testDataRetrieval = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const [capas, complaints] = await Promise.all([
        databaseService.getCAPAs(),
        databaseService.getComplaints()
      ]);
      
      setMessage({ 
        type: 'success', 
        text: `Retrieved ${capas.length} CAPAs and ${complaints.length} complaints` 
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Data retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Database Operations Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert className={message.type === 'error' ? 'border-red-500' : 'border-green-500'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Test CAPA Creation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capa-title">Title</Label>
              <Input
                id="capa-title"
                value={capaForm.title}
                onChange={(e) => setCAPAForm({ ...capaForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="capa-assigned">Assigned To</Label>
              <Input
                id="capa-assigned"
                value={capaForm.assigned_to}
                onChange={(e) => setCAPAForm({ ...capaForm, assigned_to: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="capa-description">Description</Label>
              <Textarea
                id="capa-description"
                value={capaForm.description}
                onChange={(e) => setCAPAForm({ ...capaForm, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={testCAPACreation} disabled={loading}>
            Test CAPA Creation
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Test Complaint Creation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="complaint-title">Title</Label>
              <Input
                id="complaint-title"
                value={complaintForm.title}
                onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="complaint-description">Description</Label>
              <Textarea
                id="complaint-description"
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={testComplaintCreation} disabled={loading}>
            Test Complaint Creation
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Test Data Retrieval</h3>
          <Button onClick={testDataRetrieval} disabled={loading}>
            Test Data Retrieval
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseTestComponent;
