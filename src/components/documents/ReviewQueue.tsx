
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useDocument } from '@/contexts/DocumentContext';
import { Document } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ReviewQueue: React.FC = () => {
  const { documents, loading, error, updateDocument } = useDocument();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [processingDocs, setProcessingDocs] = useState<Set<string>>(new Set());

  // Filter documents that need review
  const reviewDocuments = useMemo(() => {
    if (!documents) return [];

    let filtered = documents.filter(doc => {
      // Documents pending review
      if (doc.status === 'Pending_Review') return true;
      
      // Documents that need scheduled review
      if (doc.next_review_date && new Date(doc.next_review_date) <= new Date()) return true;
      
      // Documents approaching expiry (within 30 days)
      if (doc.expiry_date) {
        const expiryDate = new Date(doc.expiry_date);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (expiryDate <= thirtyDaysFromNow) return true;
      }
      
      return false;
    });

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(term) ||
        doc.description?.toLowerCase().includes(term) ||
        doc.created_by.toLowerCase().includes(term) ||
        doc.category.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'pending_review') {
        filtered = filtered.filter(doc => doc.status === 'Pending_Review');
      } else if (selectedFilter === 'scheduled_review') {
        filtered = filtered.filter(doc => 
          doc.next_review_date && new Date(doc.next_review_date) <= new Date()
        );
      } else if (selectedFilter === 'expiring') {
        filtered = filtered.filter(doc => {
          if (!doc.expiry_date) return false;
          const expiryDate = new Date(doc.expiry_date);
          const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          return expiryDate <= thirtyDaysFromNow;
        });
      }
    }

    return filtered.sort((a, b) => {
      // Sort by urgency: expired first, then by review date
      const aUrgent = a.expiry_date && new Date(a.expiry_date) < new Date();
      const bUrgent = b.expiry_date && new Date(b.expiry_date) < new Date();
      
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      
      // Then by review date
      if (a.next_review_date && b.next_review_date) {
        return new Date(a.next_review_date).getTime() - new Date(b.next_review_date).getTime();
      }
      
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [documents, searchTerm, selectedFilter]);

  const handleStartReview = async (documentId: string) => {
    setProcessingDocs(prev => new Set([...prev, documentId]));
    try {
      await updateDocument(documentId, {
        status: 'Pending_Review',
        pending_since: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to start review:", err);
    } finally {
      setProcessingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handleCompleteReview = async (documentId: string) => {
    setProcessingDocs(prev => new Set([...prev, documentId]));
    try {
      const nextReviewDate = new Date();
      nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1); // Set next review to 1 year from now
      
      await updateDocument(documentId, {
        status: 'Approved',
        last_review_date: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString(),
        pending_since: undefined
      });
    } catch (err) {
      console.error("Failed to complete review:", err);
    } finally {
      setProcessingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const getDocumentType = (doc: Document) => {
    if (doc.status === 'Pending_Review') return 'pending';
    if (doc.next_review_date && new Date(doc.next_review_date) <= new Date()) return 'scheduled';
    if (doc.expiry_date) {
      const expiryDate = new Date(doc.expiry_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      if (expiryDate < now) return 'expired';
      if (expiryDate <= thirtyDaysFromNow) return 'expiring';
    }
    return 'normal';
  };

  const getDocumentTypeInfo = (type: string) => {
    switch (type) {
      case 'expired':
        return { label: 'Expired', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      case 'expiring':
        return { label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'pending':
        return { label: 'Pending Review', color: 'bg-blue-100 text-blue-800', icon: Clock };
      case 'scheduled':
        return { label: 'Scheduled Review', color: 'bg-purple-100 text-purple-800', icon: Calendar };
      default:
        return { label: 'Review Required', color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Document Review Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Loading review queue...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Review Queue Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Document Review Queue
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {reviewDocuments.length} Items
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Documents requiring review, scheduled reviews, and expiring documents
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">
                  {reviewDocuments.filter(doc => doc.status === 'Pending_Review').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled Reviews</p>
                <p className="text-2xl font-bold">
                  {reviewDocuments.filter(doc => 
                    doc.next_review_date && new Date(doc.next_review_date) <= new Date()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold">
                  {reviewDocuments.filter(doc => {
                    if (!doc.expiry_date) return false;
                    const expiryDate = new Date(doc.expiry_date);
                    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    return expiryDate <= thirtyDaysFromNow;
                  }).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Queue</p>
                <p className="text-2xl font-bold">{reviewDocuments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {reviewDocuments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter: {selectedFilter === 'all' ? 'All' : selectedFilter.replace('_', ' ')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                    All Items
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('pending_review')}>
                    Pending Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('scheduled_review')}>
                    Scheduled Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('expiring')}>
                    Expiring Documents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Queue */}
      <Card>
        <CardHeader>
          <CardTitle>
            Documents Requiring Review ({reviewDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewDocuments.length > 0 ? (
            <div className="space-y-4">
              {reviewDocuments.map((doc) => {
                const isProcessing = processingDocs.has(doc.id);
                const docType = getDocumentType(doc);
                const typeInfo = getDocumentTypeInfo(docType);
                const IconComponent = typeInfo.icon;
                
                return (
                  <div key={doc.id} className="border rounded-lg p-6 bg-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-lg">{doc.title}</h3>
                          <Badge className={typeInfo.color}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                        </div>
                        
                        {doc.description && (
                          <p className="text-muted-foreground">{doc.description}</p>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Created by: {doc.created_by}</span>
                          </div>
                          <span>Version: {doc.version}</span>
                          <span>Category: {doc.category}</span>
                          {doc.last_review_date && (
                            <span>
                              Last reviewed: {formatDistanceToNow(new Date(doc.last_review_date), { addSuffix: true })}
                            </span>
                          )}
                        </div>

                        {/* Review/Expiry Information */}
                        <div className="space-y-1 text-sm">
                          {doc.next_review_date && (
                            <div className="flex items-center gap-1 text-purple-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Next review: {new Date(doc.next_review_date) <= new Date() 
                                  ? 'Overdue' 
                                  : formatDistanceToNow(new Date(doc.next_review_date), { addSuffix: true })
                                }
                              </span>
                            </div>
                          )}
                          {doc.expiry_date && (
                            <div className={`flex items-center gap-1 ${
                              new Date(doc.expiry_date) < new Date() ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              <AlertCircle className="h-4 w-4" />
                              <span>
                                Expires: {new Date(doc.expiry_date) < new Date() 
                                  ? 'Expired' 
                                  : formatDistanceToNow(new Date(doc.expiry_date), { addSuffix: true })
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {doc.status !== 'Pending_Review' ? (
                        <Button
                          onClick={() => handleStartReview(doc.id)}
                          disabled={isProcessing}
                          variant="outline"
                        >
                          {isProcessing ? (
                            <>
                              <Clock className="mr-2 h-4 w-4 animate-spin" />
                              Starting Review...
                            </>
                          ) : (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              Start Review
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleCompleteReview(doc.id)}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isProcessing ? (
                            <>
                              <Clock className="mr-2 h-4 w-4 animate-spin" />
                              Completing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Review
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Review queue is empty</h3>
              <p className="text-muted-foreground">
                No documents currently require review.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewQueue;
