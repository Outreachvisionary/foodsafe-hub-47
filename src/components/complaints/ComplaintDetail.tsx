import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Package, 
  Building, 
  Phone, 
  FileText, 
  Zap,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { Complaint } from '@/types/complaint';
import { deleteComplaint } from '@/services/complaintService';
import { toast } from 'sonner';

interface ComplaintDetailProps {
  complaint: Complaint;
  onBack: () => void;
  onUpdate: () => void;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaint, onBack, onUpdate }) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/complaints/edit/${complaint.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComplaint(complaint.id);
      toast.success('Complaint deleted successfully');
      setIsDeleteDialogOpen(false);
      onBack();
    } catch (error) {
      toast.error('Failed to delete complaint');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Complaints
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Complaint</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Are you sure you want to delete this complaint? This action cannot be undone.</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{complaint.status}</Badge>
                      <Badge variant="outline">{complaint.category}</Badge>
                      <Badge variant="secondary">{complaint.priority}</Badge>
                    </div>
                  </div>
                  {complaint.capa_id && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Zap className="h-3 w-3 mr-1" />
                      CAPA Linked
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Reported:</span>
                      <span>{format(new Date(complaint.reported_date), 'PPP')}</span>
                    </div>
                    {complaint.resolution_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Resolved:</span>
                        <span>{format(new Date(complaint.resolution_date), 'PPP')}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Created by:</span>
                      <span>{complaint.created_by}</span>
                    </div>
                    {complaint.assigned_to && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Assigned to:</span>
                        <span>{complaint.assigned_to}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint.customer_name ? (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{complaint.customer_name}</span>
                    </div>
                    {complaint.customer_contact && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{complaint.customer_contact}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">No customer information available</p>
                )}
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint.product_involved ? (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{complaint.product_involved}</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No product specified</p>
                )}
                {complaint.lot_number && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Lot: {complaint.lot_number}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CAPA Integration */}
            {complaint.capa_id && (
              <Card className="shadow-lg border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Zap className="h-4 w-4" />
                    CAPA Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-700 mb-3">
                    This complaint has an associated CAPA for systematic resolution.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/capa/${complaint.capa_id}`)}
                    className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  >
                    View CAPA
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;