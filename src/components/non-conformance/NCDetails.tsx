
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, File, FileText, MessageSquare, Users } from "lucide-react";
import LinkedCAPAsList from "@/components/capa/LinkedCAPAsList";

// Define the NonConformance interface since it's missing
interface NonConformance {
  id: string;
  title: string;
  description: string;
  status: string; // Using string instead of enum for flexibility
  item_category: string;
  reason_category: string;
  reported_date: string;
  resolution_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  reason_details?: string;
  resolution_details?: string;
  risk_level?: string;
  priority?: string;
  capa_id?: string;
}

interface NCActivityTimelineProps {
  nonConformanceId: string;
}

const NCActivityTimeline: React.FC<NCActivityTimelineProps> = ({ nonConformanceId }) => {
  // Placeholder component
  return <div>Activity timeline for NC #{nonConformanceId}</div>;
};

interface NCActionButtonsProps {
  nonConformance: NonConformance;
  onUpdate: (updated: NonConformance) => void;
}

const NCActionButtons: React.FC<NCActionButtonsProps> = ({ nonConformance, onUpdate }) => {
  // Placeholder component
  return <div className="flex justify-end mt-4">
    <Button variant="outline" className="mr-2">Edit</Button>
    <Button>Take Action</Button>
  </div>;
};

interface NCDetailsProps {
  id: string;
  onClose?: () => void;
}

export const NCDetails: React.FC<{ nonConformance: NonConformance }> = ({ nonConformance }) => {
  const [activeTab, setActiveTab] = useState("details");
  
  const handleUpdate = (updated: NonConformance) => {
    console.log("Updating non-conformance:", updated);
    // In a real app, this would update the state and save to backend
  };
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Non-Conformance Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="related">Related CAPAs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Title</h4>
                <p>{nonConformance.title}</p>
              </div>
              <div>
                <h4 className="font-semibold">Status</h4>
                <Badge variant="secondary">{nonConformance.status}</Badge>
              </div>
              <div>
                <h4 className="font-semibold">Priority</h4>
                <p>{nonConformance.priority || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Created By</h4>
                <p>{nonConformance.created_by}</p>
              </div>
              <div>
                <h4 className="font-semibold">Report Date</h4>
                <p>
                  <Calendar className="mr-2 h-4 w-4 inline-block" />
                  {new Date(nonConformance.reported_date).toLocaleDateString()}
                </p>
              </div>
              {nonConformance.resolution_date && (
                <div>
                  <h4 className="font-semibold">Resolution Date</h4>
                  <p>
                    <Clock className="mr-2 h-4 w-4 inline-block" />
                    {new Date(nonConformance.resolution_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-semibold">Category</h4>
                <p>{nonConformance.item_category}</p>
              </div>
              <div>
                <h4 className="font-semibold">Severity</h4>
                <p>{nonConformance.risk_level || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold">Description</h4>
                <p>{nonConformance.description || 'No description provided'}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold">Reason Details</h4>
                <p>{nonConformance.reason_details || 'No immediate actions recorded'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Root Cause</h4>
                <p>{nonConformance.reason_category || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Resolution Details</h4>
                <p>{nonConformance.resolution_details || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Assigned To</h4>
                <p>
                  <Users className="mr-2 h-4 w-4 inline-block" />
                  {nonConformance.assigned_to || 'Unassigned'}
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="related">
            <LinkedCAPAsList capaIds={nonConformance.capa_id ? [nonConformance.capa_id] : []} />
          </TabsContent>
          <TabsContent value="activity">
            <NCActivityTimeline nonConformanceId={nonConformance.id} />
          </TabsContent>
        </Tabs>
        <NCActionButtons nonConformance={nonConformance} onUpdate={handleUpdate} />
      </CardContent>
    </Card>
  );
};

export default NCDetails;
