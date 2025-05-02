
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarClock, CheckCircle, User2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrainingStatus } from '@/types/enums';

interface TrainingRecordItem {
  id: string;
  employee: string;
  course: string;
  status: string;
  dueDate: string;
  completionDate: string | null;
}

const TrainingRecords = () => {
  const [records, setRecords] = useState<TrainingRecordItem[]>([
    {
      id: '1',
      employee: 'John Doe',
      course: 'Food Safety Basics',
      status: 'Completed',
      dueDate: '2024-03-15',
      completionDate: '2024-03-10',
    },
    {
      id: '2',
      employee: 'Jane Smith',
      course: 'HACCP Principles',
      status: 'In Progress',
      dueDate: '2024-04-01',
      completionDate: null,
    },
    {
      id: '3',
      employee: 'Alice Johnson',
      course: 'GMP Training',
      status: 'Overdue',
      dueDate: '2024-02-28',
      completionDate: null,
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Training Records</h2>
        <p className="text-muted-foreground">
          Manage and view employee training records
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Training Records</CardTitle>
          <CardDescription>
            View and manage all training records in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Employee</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Completion Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/api/others/${record.employee}.png`} />
                          <AvatarFallback>{record.employee.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{record.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.course}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.status}</Badge>
                    </TableCell>
                    <TableCell>{record.dueDate}</TableCell>
                    <TableCell>{record.completionDate || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingRecords;
