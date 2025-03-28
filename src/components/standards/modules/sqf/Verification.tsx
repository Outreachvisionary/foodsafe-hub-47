
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2 } from 'lucide-react';

const Verification = () => {
  const verificationActivities = [
    { 
      activity: 'Internal Audits', 
      frequency: 'Monthly or quarterly', 
      responsibility: 'QA Manager',
      records: 'Audit reports, corrective action records'
    },
    { 
      activity: 'Pre-operational Inspections', 
      frequency: 'Daily', 
      responsibility: 'Production Supervisor',
      records: 'Pre-op checklists, non-conformance reports'
    },
    { 
      activity: 'CCP Verification', 
      frequency: 'Weekly', 
      responsibility: 'Food Safety Manager',
      records: 'CCP monitoring records, calibration records'
    },
    { 
      activity: 'Product Testing', 
      frequency: 'Per production lot', 
      responsibility: 'QC Technician',
      records: 'Lab test results, certificates of analysis'
    },
    { 
      activity: 'Environmental Monitoring', 
      frequency: 'Weekly', 
      responsibility: 'QA Technician',
      records: 'Swab test results, trend analysis'
    },
    { 
      activity: 'Management Review', 
      frequency: 'Quarterly', 
      responsibility: 'Senior Management',
      records: 'Meeting minutes, action plans'
    },
    { 
      activity: 'Food Safety Plan Review', 
      frequency: 'Annually or upon changes', 
      responsibility: 'HACCP Team',
      records: 'Hazard analysis, HACCP plan updates'
    },
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Verification Activities
          </CardTitle>
          <CardDescription>
            Processes to verify the effectiveness of your SQF system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Verification is the application of methods, procedures, tests, and other evaluations to determine compliance with the SQF code.
            It confirms that monitoring is effectively controlling the identified food safety hazards.
          </p>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Verification Activity</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Responsibility</TableHead>
                <TableHead>Records</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verificationActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.activity}</TableCell>
                  <TableCell>{activity.frequency}</TableCell>
                  <TableCell>{activity.responsibility}</TableCell>
                  <TableCell>{activity.records}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Implementing Effective Verification</CardTitle>
          <CardDescription>
            Keys to a successful verification program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Schedule</h3>
              <p>Develop a comprehensive verification schedule that includes all activities, frequencies, and responsibilities. Ensure it's communicated to all relevant staff.</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Methods</h3>
              <p>Use appropriate scientific methods for verification activities. Ensure equipment and techniques are validated for their intended use.</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Documentation</h3>
              <p>Maintain detailed records of all verification activities. Document findings, deviations, and corrective actions in a clear, retrievable format.</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Trend Analysis</h3>
              <p>Analyze verification data over time to identify trends and patterns. Use this information to drive continuous improvement and prevent recurring issues.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verification;
