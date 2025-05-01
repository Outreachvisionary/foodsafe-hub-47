
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, Info, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import LinkedCAPAsList from '@/components/capa/LinkedCAPAsList';
import { CAPA } from '@/types/capa'; 

interface NCDetailsProps {
  id: string;
  title: string;
  description?: string;
  status: string;
  itemName: string;
  itemCategory: string;
  reportedDate: string;
  createdBy: string;
  assignedTo?: string;
  reviewDate?: string;
  resolutionDate?: string;
  quantity?: number;
  quantityOnHold?: number;
  units?: string;
  reasonCategory?: string;
  reasonDetails?: string;
  resolution?: string;
  linkedCAPAs?: CAPA[];
  onAddCAPA?: () => void;
}

const NCDetails: React.FC<NCDetailsProps> = ({
  id,
  title,
  description,
  status,
  itemName,
  itemCategory,
  reportedDate,
  createdBy,
  assignedTo,
  reviewDate,
  resolutionDate,
  quantity,
  quantityOnHold,
  units,
  reasonCategory,
  reasonDetails,
  resolution,
  linkedCAPAs = [],
  onAddCAPA,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'released':
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disposed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">ID: {id} • Reported: {formatDate(reportedDate)}</p>
        </div>
        <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="mt-1">{description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Non-Conforming Item</h3>
              <p className="mt-1">{itemName}</p>
              <p className="text-sm text-muted-foreground mt-1">Category: {itemCategory}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
              <p className="mt-1">
                {quantity !== undefined ? `${quantity} ${units || 'units'}` : 'Not specified'}
                {quantityOnHold !== undefined && quantityOnHold > 0 && ` (${quantityOnHold} on hold)`}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
              <p className="mt-1">{reasonCategory || 'Not categorized'}</p>
              <p className="text-sm mt-1">{reasonDetails || 'No details provided.'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Resolution</h3>
              <p className="mt-1">{resolution || 'Not yet resolved'}</p>
              {resolutionDate && (
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Resolved on: {formatDate(resolutionDate)}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Reported by</p>
                <p className="text-sm text-muted-foreground">{createdBy}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned to</p>
                <p className="text-sm text-muted-foreground">{assignedTo || 'Unassigned'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Review date</p>
                <p className="text-sm text-muted-foreground">{formatDate(reviewDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <LinkedCAPAsList capas={linkedCAPAs} onLinkCAPA={onAddCAPA} />

      {status === 'On Hold' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">This item is currently on hold</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The non-conforming item has been identified and placed on hold pending review.
                  No action should be taken until a disposition decision has been made.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(status === 'Under Review' || status === 'Pending Review') && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Under review</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This non-conformance is currently being reviewed by the quality team.
                  A disposition decision will be made soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NCDetails;
