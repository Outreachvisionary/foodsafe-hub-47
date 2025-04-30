
import { useMemo } from 'react';
import { Document } from '@/types/document';
import { DocumentStatus } from '@/types/enums';
import { Grid, GridItem } from '@/components/ui/grid';
import { isStatusEqual } from '@/utils/typeAdapters';
import DocumentCard from './DocumentCard';

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
      if (filter === 'active') {
        return isStatusEqual(doc.status, DocumentStatus.Active);
      } else if (filter === 'archived') {
        return isStatusEqual(doc.status, DocumentStatus.Archived);
      } else if (filter === 'draft') {
        return isStatusEqual(doc.status, DocumentStatus.Draft);
      } else if (filter === 'rejected') {
        return isStatusEqual(doc.status, DocumentStatus.Rejected);
      } else if (filter === 'pending_review') {
        return isStatusEqual(doc.status, DocumentStatus.PendingReview);
      } else if (filter === 'expired') {
        return isStatusEqual(doc.status, DocumentStatus.Expired);
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
