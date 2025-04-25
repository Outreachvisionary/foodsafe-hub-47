import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, File, FileText, MessageSquare, Users } from "lucide-react";
import { NonConformance } from "@/types/non-conformance";
import LinkedCAPAsList from "./LinkedCAPAsList";
import NCActionButtons from "./NCActionButtons";
import NCActivityTimeline from "./NCActivityTimeline";

const NCDetails = ({ nonConformance }: { nonConformance: NonConformance }) => {
  const [activeTab, setActiveTab] = useState("details");
  
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
                <p>{nonConformance.priority}</p>
              </div>
              <div>
                <h4 className="font-semibold">Raised By</h4>
                <p>{nonConformance.raised_by}</p>
              </div>
              <div>
                <h4 className="font-semibold">Date Raised</h4>
                <p>
                  <Calendar className="mr-2 h-4 w-4 inline-block" />
                  {new Date(nonConformance.date_raised).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Due Date</h4>
                <p>
                  <Clock className="mr-2 h-4 w-4 inline-block" />
                  {new Date(nonConformance.due_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Category</h4>
                <p>{nonConformance.category}</p>
              </div>
              <div>
                <h4 className="font-semibold">Severity</h4>
                <p>{nonConformance.severity}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold">Description</h4>
                <p>{nonConformance.description}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold">Immediate Actions Taken</h4>
                <p>{nonConformance.immediate_actions}</p>
              </div>
              <div>
                <h4 className="font-semibold">Root Cause</h4>
                <p>{nonConformance.root_cause}</p>
              </div>
              <div>
                <h4 className="font-semibold">Corrective Actions</h4>
                <p>{nonConformance.corrective_actions}</p>
              </div>
              <div>
                <h4 className="font-semibold">Preventive Actions</h4>
                <p>{nonConformance.preventive_actions}</p>
              </div>
              <div>
                <h4 className="font-semibold">Assigned To</h4>
                <p>
                  <Users className="mr-2 h-4 w-4 inline-block" />
                  {nonConformance.assigned_to}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Attachments</h4>
                <p>
                  <FileText className="mr-2 h-4 w-4 inline-block" />
                  {nonConformance.attachments || "No attachments"}
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="related">
            <LinkedCAPAsList ncId={nonConformance.id} />
          </TabsContent>
          <TabsContent value="activity">
            <NCActivityTimeline ncId={nonConformance.id} />
          </TabsContent>
        </Tabs>
        <NCActionButtons ncId={nonConformance.id} status={nonConformance.status} />
      </CardContent>
    </Card>
  );
};

export default NCDetails;
