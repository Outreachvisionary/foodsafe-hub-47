
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StatusBadge from './StatusBadge';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No data available"
}) => {
  const renderCellValue = (column: Column, item: any) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    // Auto-render common field types
    if (column.key.toLowerCase().includes('status')) {
      return <StatusBadge status={value} />;
    }
    
    if (column.key.toLowerCase().includes('date') && value) {
      return new Date(value).toLocaleDateString();
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value || '-';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="grid gap-4 p-4 bg-muted/30 border-b border-border font-medium text-sm text-muted-foreground" 
           style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) auto` }}>
        {columns.map((column) => (
          <div key={column.key}>{column.label}</div>
        ))}
        <div>Actions</div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-border">
        {data.map((item, index) => (
          <div
            key={item.id || index}
            className="grid gap-4 p-4 hover:bg-muted/30 transition-colors"
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr) auto` }}
          >
            {columns.map((column) => (
              <div key={column.key} className="text-sm">
                {renderCellValue(column, item)}
              </div>
            ))}
            
            {/* Actions */}
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(item)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(item)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
