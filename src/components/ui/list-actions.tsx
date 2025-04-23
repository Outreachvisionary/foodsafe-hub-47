
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface ListActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disableView?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
}

export const ListActions: React.FC<ListActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  disableView = false,
  disableEdit = false,
  disableDelete = false
}) => {
  return (
    <div className="flex gap-2">
      {onView && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onView}
          disabled={disableView}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          disabled={disableEdit}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={disableDelete}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
