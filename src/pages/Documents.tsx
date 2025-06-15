
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocument } from '@/contexts/DocumentContext';
import DocumentRepositoryView from '@/components/documents/DocumentRepositoryView';
import ReviewQueue from '@/components/documents/ReviewQueue';
import ExpiredDocuments from '@/components/documents/ExpiredDocuments';
import ApprovalWorkflow from '@/components/documents/ApprovalWorkflow';
import DocumentStats from '@/components/documents/DocumentStats';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('repository');
  const { documents, stats } = useDocument();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="repository">Repository</TabsTrigger>
          <TabsTrigger value="approvals">
            Workflow
            {stats?.pendingApprovalCount > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.pendingApprovalCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="review">
            Review Queue
            {stats?.pendingReviewCount > 0 && (
              <span className="ml-1 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.pendingReviewCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expiring
            {stats?.expiringCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.expiringCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="repository" className="space-y-6">
          <DocumentRepositoryView />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <ApprovalWorkflow />
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <ReviewQueue />
        </TabsContent>

        <TabsContent value="expired" className="space-y-6">
          <ExpiredDocuments />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DocumentStats documents={documents} stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;
