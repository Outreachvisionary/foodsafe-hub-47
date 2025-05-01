
import { useMemo } from 'react';
import { Document } from '@/types/document';
import { DocumentStatus } from '@/types/enums';
import { Grid, GridItem } from '@/components/ui/grid';
import DocumentCard from './DocumentCard';
import { isDocumentStatusEqual } from '@/utils/typeAdapters';

interface DocumentGridProps {
  documents: Document[];
  filter?: 'active' | 'archived' | 'draft' | 'rejected' | 'pending_review' | 'expired' | 'all';
  onDocumentClick?: (document: Document) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents, filter = 'all', onDocumentClick }) => {
  const filteredDocuments = useMemo(() => {
    if (filter === 'all') {
      return documents;
    }

    return documents.filter(doc => {
      const docStatus = doc.status;
      
      if (filter === 'active') {
        return isDocumentStatusEqual(docStatus, DocumentStatus.Active);
      } else if (filter === 'archived') {
        return isDocumentStatusEqual(docStatus, DocumentStatus.Archived);
      } else if (filter === 'draft') {
        return isDocumentStatusEqual(docStatus, DocumentStatus.Draft);
      } else if (filter === 'rejected') {
        return isDocumentStatusEqual(docStatus, DocumentStatus.Rejected);
      } else if (filter === 'pending_review') {
        return isDocumentStatusEqual(docStatus, DocumentStatus.PendingReview);
      } else if (filter === 'expired') {
        return isDocumentStatusEqual(docStatus, DocumentStatus.Expired);
      }
      return true;
    });
  }, [documents, filter]);

  return (
    <Grid numColsSm={2} numColsMd={3} numColsLg={4} className="gap-4">
      {filteredDocuments.map((document) => (
        <GridItem key={document.id}>
          <DocumentCard document={document} onClick={() => onDocumentClick?.(document)} />
        </GridItem>
      ))}
    </Grid>
  );
};

export default DocumentGrid;
