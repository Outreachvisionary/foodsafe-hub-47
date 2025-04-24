import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { Complaint, ComplaintStatus } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { CheckCircle, AlertTriangle, ArchiveRestore, Database } from 'lucide-react';
import { mapStatusToInternal } from '@/services/capa/capaStatusService';

interface ComplaintDetailsProps {
  complaint: Complaint;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint }) => {
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState('');

  const handleAddNote = () => {
    // Implement add note logic here
    setOpen(false);
  };

  // Convert database status values to UI display format
  const getStatusForDisplay = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'New';
      case 'under_investigation':
        return 'Under Investigation';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      case 'reopened':
        return 'Reopened';
      default:
        return status;
    }
  };

  // Fix status comparison by using the exact string values from ComplaintStatus type
  const showNewButton = complaint.status === 'New';
  const showInProgressButton = complaint.status === 'New' || complaint.status === 'Reopened';
  const showResolvedButton = complaint.status === 'Under_Investigation';
  const showReopenButton = complaint.status === 'Resolved';
  const showArchiveButton = complaint.status !== 'New';
  const showCloseButton = complaint.status !== 'New';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complaint Details</CardTitle>
        <CardDescription>
          Information about the selected complaint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Complaint ID
              </h3>
              <p>{complaint.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Date Reported
              </h3>
              <p>{format(new Date(complaint.reported_date), 'PPP')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Customer Name
              </h3>
              <p>{complaint.customer_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Contact Information
              </h3>
              <p>{complaint.customer_contact}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Product Involved
              </h3>
              <p>{complaint.product_involved}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Lot Number
              </h3>
              <p>{complaint.lot_number}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Complaint Details
            </h3>
            <p>{complaint.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Category
              </h3>
              <p>{complaint.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Priority
              </h3>
              <p>{complaint.priority}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Status
              </h3>
              <p>
                <Badge
                  className={
                    complaint.status === 'New'
                      ? 'bg-blue-100 text-blue-800'
                      : complaint.status === 'Under_Investigation'
                      ? 'bg-yellow-100 text-yellow-800'
                      : complaint.status === 'Resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {getStatusForDisplay(complaint.status)}
                </Badge>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Assigned To
              </h3>
              <p>{complaint.assigned_to}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Resolution Details
            </h3>
            <p>{complaint.resolution_details || 'No resolution details available'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
            <ScrollArea className="h-40">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Add Note</AccordionTrigger>
                  <AccordionContent>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add Note</DialogTitle>
                          <DialogDescription>
                            Add a note to the complaint.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="note" className="text-right">
                              Note
                            </Label>
                            <Textarea
                              id="note"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddNote}>Add Note</Button>
                      </DialogContent>
                    </Dialog>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>View Notes</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      There are no notes for this complaint.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
