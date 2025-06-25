
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';

interface ModuleLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onCreateNew?: () => void;
  createButtonText?: string;
  stats?: Array<{
    label: string;
    value: number;
    color: string;
    bgColor: string;
  }>;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  title,
  subtitle,
  children,
  searchPlaceholder = "Search...",
  onSearch,
  onCreateNew,
  createButtonText = "Create New",
  stats = [],
  filters,
  actions
}) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {onCreateNew && (
            <Button onClick={onCreateNew} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              {createButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${stat.bgColor}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9 border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            {filters && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {filters}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleLayout;
