
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from '@/hooks/use-toast';
import { DocumentStatus } from '@/types/document';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adaptDatabaseToDocument, adaptDocumentToDatabase } from '@/utils/documentTypeAdapter';
import { Document as DocumentType } from '@/types/database';

interface ExpiredDocumentsProps {
  documents: DocumentType[];
  onDocumentUpdated?: (document: DocumentType) => void;
}

const ExpiredDocuments: React.FC<ExpiredDocumentsProps> = ({ documents = [], onDocumentUpdated }) => {
  const [docs, setDocs] = useState<DocumentType[]>(documents);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState<Date | undefined>(undefined);
  const [newStatus, setNewStatus] = useState<DocumentStatus>("Draft");
  const { toast } = useToast();

  useEffect(() => {
    setDocs(documents);
  }, [documents]);

  const handleViewDocument = (doc: DocumentType) => {
    // No need to adapt since we're already using the correct type
    setSelectedDocument(doc); 
    setViewDialogOpen(true);
  };

  const handleRenewDocument = (doc: DocumentType) => {
    // No need to adapt since we're already using the correct type
    setSelectedDocument(doc);
    setRenewDialogOpen(true);
  };

  const handleUpdateDocument = (updatedDoc: DocumentType) => {
    setDocs(prevDocs => 
      prevDocs.map(doc => 
        doc.id === updatedDoc.id ? updatedDoc : doc
      )
    );
    fetchDocuments();
    setRenewDialogOpen(false);
  };

  const handleRenew = async () => {
    if (!selectedDocument || !newExpiryDate) {
      toast({
        title: "Error",
        description: "Please select a document and an expiry date.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update the document with the new expiry date and status
      const updatedDocument: DocumentType = {
        ...selectedDocument,
        expiry_date: newExpiryDate.toISOString(),
        status: newStatus as any, // Cast to appropriate type for database
      };

      // Call the onDocumentUpdated prop to update the document in the parent component
      onDocumentUpdated?.(updatedDocument);

      // Update the local state
      handleUpdateDocument(updatedDocument);

      toast({
        title: "Success",
        description: "Document renewed successfully.",
      });
      setRenewDialogOpen(false);
    } catch (error) {
      console.error("Error renewing document:", error);
      toast({
        title: "Error",
        description: "Failed to renew document.",
        variant: "destructive",
      });
    }
  };

  const fetchDocuments = () => {
    // Mock implementation to simulate fetching documents
    // In a real application, you would fetch the documents from an API
    // and update the state with the fetched documents
    // For now, we just update the state with the current documents
    setDocs(documents);
  };

  return (
    <div>
      {docs.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No expired documents found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>{doc.category}</TableCell>
                <TableCell>
                  {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                    View
                  </Button>
                  <Button variant="default" size="sm" onClick={() => handleRenewDocument(doc)}>
                    Renew
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
            <DialogDescription>
              {selectedDocument?.description || 'No description available'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input type="text" id="title" value={selectedDocument?.title || ''} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input type="text" id="category" value={selectedDocument?.category || ''} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry_date" className="text-right">
                Expiry Date
              </Label>
              <Input type="text" id="expiry_date" value={selectedDocument?.expiry_date ? new Date(selectedDocument.expiry_date).toLocaleDateString() : 'N/A'} readOnly className="col-span-3" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renew Document</DialogTitle>
            <DialogDescription>
              Select a new expiry date and status for the document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new_expiry_date" className="text-right">
                New Expiry Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !newExpiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newExpiryDate ? format(newExpiryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={newExpiryDate}
                    onSelect={setNewExpiryDate}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new_status" className="text-right">
                New Status
              </Label>
              <Select onValueChange={(value) => setNewStatus(value as DocumentStatus)}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleRenew}>Renew Document</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpiredDocuments;
