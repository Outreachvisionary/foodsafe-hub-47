
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Archive, 
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Document, type DocumentStats as DocumentStatsType } from '@/types/document';

interface DocumentStatsProps {
  documents: Document[];
  stats?: DocumentStatsType | null;
}

const DocumentStats: React.FC<DocumentStatsProps> = ({ documents, stats }) => {
  // Calculate stats if not provided
  const calculatedStats = stats || {
    total: documents.length,
    byStatus: documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byCategory: documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    expiringCount: documents.filter(doc => 
      doc.expiry_date && new Date(doc.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length,
    pendingReviewCount: documents.filter(doc => doc.status === 'Pending_Review').length,
    pendingApprovalCount: documents.filter(doc => doc.status === 'Pending_Approval').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Published':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Draft':
        return <FileText className="h-5 w-5 text-gray-600" />;
      case 'Pending_Review':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Pending_Approval':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'Rejected':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'Archived':
        return <Archive className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Pending_Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending_Approval':
        return 'bg-orange-100 text-orange-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{calculatedStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{calculatedStats.pendingReviewCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-orange-600">{calculatedStats.pendingApprovalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-red-600">{calculatedStats.expiringCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Documents by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(calculatedStats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <span className="font-medium">{status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getStatusColor(status)}>
                      {String(count)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {calculatedStats.total > 0 ? Math.round((count / calculatedStats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Archive className="h-5 w-5 mr-2" />
              Documents by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(calculatedStats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {category === 'SOP' && '📋'}
                      {category === 'Policy' && '📜'}
                      {category === 'Training Material' && '📖'}
                      {category === 'Form' && '📝'}
                      {category === 'Audit Report' && '📊'}
                      {category === 'Certificate' && '🏆'}
                      {!['SOP', 'Policy', 'Training Material', 'Form', 'Audit Report', 'Certificate'].includes(category) && '📄'}
                    </span>
                    <span className="font-medium">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {String(count)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {calculatedStats.total > 0 ? Math.round((count / calculatedStats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Recent Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents
              .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
              .slice(0, 5)
              .map((document) => (
                <div key={document.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {document.category === 'SOP' && '📋'}
                      {document.category === 'Policy' && '📜'}
                      {document.category === 'Training Material' && '📖'}
                      {document.category === 'Form' && '📝'}
                      {document.category === 'Audit Report' && '📊'}
                      {document.category === 'Certificate' && '🏆'}
                      {!['SOP', 'Policy', 'Training Material', 'Form', 'Audit Report', 'Certificate'].includes(document.category) && '📄'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{document.title}</p>
                      <p className="text-sm text-gray-500">
                        Updated {new Date(document.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(document.status)}>
                    {document.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentStats;
