import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';
import { CAPAFilter, CAPAStatus, CAPAPriority, CAPASource } from '@/types/capa';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface CAPAFiltersProps {
  filters: CAPAFilter;
  setFilters: React.Dispatch<React.SetStateAction<CAPAFilter>>;
  searchQuery?: string;
}

const CAPAFilters: React.FC<CAPAFiltersProps> = ({ filters, setFilters, searchQuery }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined
  );

  // Sample departments data
  const departments = [
    'Quality Assurance',
    'Production',
    'Maintenance',
    'Management',
    'Food Safety',
    'Supply Chain',
  ];

  // Handle status filter change
  const handleStatusChange = (status: CAPAStatus, checked: CheckedState) => {
    if (checked) {
      // Add status to filters
      const currentStatuses = filters.status
        ? Array.isArray(filters.status)
          ? [...filters.status]
          : [filters.status]
        : [];
      if (!currentStatuses.includes(status)) {
        setFilters((prev) => ({
          ...prev,
          status: [...currentStatuses, status],
        }));
      }
    } else {
      // Remove status from filters
      const currentStatuses = filters.status
        ? Array.isArray(filters.status)
          ? [...filters.status]
          : [filters.status]
        : [];
      setFilters((prev) => ({
        ...prev,
        status: currentStatuses.filter((s) => s !== status),
      }));
    }
  };

  // Handle priority filter change
  const handlePriorityChange = (priority: CAPAPriority, checked: CheckedState) => {
    if (checked) {
      // Add priority to filters
      const currentPriorities = filters.priority
        ? Array.isArray(filters.priority)
          ? [...filters.priority]
          : [filters.priority]
        : [];
      if (!currentPriorities.includes(priority)) {
        setFilters((prev) => ({
          ...prev,
          priority: [...currentPriorities, priority],
        }));
      }
    } else {
      // Remove priority from filters
      const currentPriorities = filters.priority
        ? Array.isArray(filters.priority)
          ? [...filters.priority]
          : [filters.priority]
        : [];
      setFilters((prev) => ({
        ...prev,
        priority: currentPriorities.filter((p) => p !== priority),
      }));
    }
  };

  // Handle source filter change
  const handleSourceChange = (source: CAPASource, checked: CheckedState) => {
    if (checked) {
      // Add source to filters
      const currentSources = filters.source
        ? Array.isArray(filters.source)
          ? [...filters.source]
          : [filters.source]
        : [];
      if (!currentSources.includes(source)) {
        setFilters((prev) => ({
          ...prev,
          source: [...currentSources, source],
        }));
      }
    } else {
      // Remove source from filters
      const currentSources = filters.source
        ? Array.isArray(filters.source)
          ? [...filters.source]
          : [filters.source]
        : [];
      setFilters((prev) => ({
        ...prev,
        source: currentSources.filter((s) => s !== source),
      }));
    }
  };

  // Handle department filter change
  const handleDepartmentChange = (department: string, checked: CheckedState) => {
    if (checked) {
      // Add department to filters
      const currentDepartments = filters.department
        ? Array.isArray(filters.department)
          ? [...filters.department]
          : [filters.department]
        : [];
      if (!currentDepartments.includes(department)) {
        setFilters((prev) => ({
          ...prev,
          department: [...currentDepartments, department],
        }));
      }
    } else {
      // Remove department from filters
      const currentDepartments = filters.department
        ? Array.isArray(filters.department)
          ? [...filters.department]
          : [filters.department]
        : [];
      setFilters((prev) => ({
        ...prev,
        department: currentDepartments.filter((d) => d !== department),
      }));
    }
  };

  // Update date range filter when dates change
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      setFilters((prev) => ({
        ...prev,
        dateRange: {
          start: date.toISOString(),
          end: prev.dateRange?.end || endDate?.toISOString() || new Date().toISOString(),
        },
      }));
    } else if (!endDate) {
      // If both start and end dates are cleared, remove the date range filter
      setFilters((prev) => ({
        ...prev,
        dateRange: undefined,
      }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      setFilters((prev) => ({
        ...prev,
        dateRange: {
          start: prev.dateRange?.start || startDate?.toISOString() || new Date().toISOString(),
          end: date.toISOString(),
        },
      }));
    } else if (!startDate) {
      // If both start and end dates are cleared, remove the date range filter
      setFilters((prev) => ({
        ...prev,
        dateRange: undefined,
      }));
    }
  };

  // Handle preset date ranges
  const applyDatePreset = (preset: 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (preset) {
      case 'last7days':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case 'last30days':
        start = new Date(now);
        start.setDate(now.getDate() - 30);
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'lastMonth':
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      default:
        start = new Date(now);
        start.setDate(now.getDate() - 7);
    }

    setStartDate(start);
    setEndDate(end);
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: undefined,
      priority: undefined,
      source: undefined,
      department: undefined,
      dateRange: undefined,
      searchTerm: searchQuery,
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // Check if a status is selected
  const isStatusSelected = (status: CAPAStatus): boolean => {
    if (!filters.status) return false;
    return Array.isArray(filters.status)
      ? filters.status.includes(status)
      : filters.status === status;
  };

  // Check if a priority is selected
  const isPrioritySelected = (priority: CAPAPriority): boolean => {
    if (!filters.priority) return false;
    return Array.isArray(filters.priority)
      ? filters.priority.includes(priority)
      : filters.priority === priority;
  };

  // Check if a source is selected
  const isSourceSelected = (source: CAPASource): boolean => {
    if (!filters.source) return false;
    return Array.isArray(filters.source)
      ? filters.source.includes(source)
      : filters.source === source;
  };

  // Check if a department is selected
  const isDepartmentSelected = (department: string): boolean => {
    if (!filters.department) return false;
    
    if (Array.isArray(filters.department)) {
      return filters.department.includes(department);
    }
    
    return filters.department === department;
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          Filters
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div>
          <Label className="text-sm font-medium mb-2 block">Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isStatusSelected(CAPAStatus.Open)}
                onCheckedChange={(checked) => handleStatusChange(CAPAStatus.Open, checked)}
              />
              <Label className="text-sm">Open</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isStatusSelected(CAPAStatus.InProgress)}
                onCheckedChange={(checked) => handleStatusChange(CAPAStatus.InProgress, checked)}
              />
              <Label className="text-sm">In Progress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isStatusSelected(CAPAStatus.Completed)}
                onCheckedChange={(checked) => handleStatusChange(CAPAStatus.Completed, checked)}
              />
              <Label className="text-sm">Completed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isStatusSelected(CAPAStatus.Closed)}
                onCheckedChange={(checked) => handleStatusChange(CAPAStatus.Closed, checked)}
              />
              <Label className="text-sm">Closed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isStatusSelected(CAPAStatus.Overdue)}
                onCheckedChange={(checked) => handleStatusChange(CAPAStatus.Overdue, checked)}
              />
              <Label className="text-sm">Overdue</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-2 block">Priority</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isPrioritySelected(CAPAPriority.Low)}
                onCheckedChange={(checked) => handlePriorityChange(CAPAPriority.Low, checked)}
              />
              <Label className="text-sm">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isPrioritySelected(CAPAPriority.Medium)}
                onCheckedChange={(checked) => handlePriorityChange(CAPAPriority.Medium, checked)}
              />
              <Label className="text-sm">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isPrioritySelected(CAPAPriority.High)}
                onCheckedChange={(checked) => handlePriorityChange(CAPAPriority.High, checked)}
              />
              <Label className="text-sm">High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isPrioritySelected(CAPAPriority.Critical)}
                onCheckedChange={(checked) => handlePriorityChange(CAPAPriority.Critical, checked)}
              />
              <Label className="text-sm">Critical</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-2 block">Source</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSourceSelected(CAPASource.Audit)}
                onCheckedChange={(checked) => handleSourceChange(CAPASource.Audit, checked)}
              />
              <Label className="text-sm">Audit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSourceSelected(CAPASource.CustomerComplaint)}
                onCheckedChange={(checked) => handleSourceChange(CAPASource.CustomerComplaint, checked)}
              />
              <Label className="text-sm">Customer Complaint</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSourceSelected(CAPASource.InternalReport)}
                onCheckedChange={(checked) => handleSourceChange(CAPASource.InternalReport, checked)}
              />
              <Label className="text-sm">Internal Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSourceSelected(CAPASource.NonConformance)}
                onCheckedChange={(checked) => handleSourceChange(CAPASource.NonConformance, checked)}
              />
              <Label className="text-sm">Non-Conformance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSourceSelected(CAPASource.SupplierIssue)}
                onCheckedChange={(checked) => handleSourceChange(CAPASource.SupplierIssue, checked)}
              />
              <Label className="text-sm">Supplier Issue</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-2 block">Department</Label>
          <div className="space-y-2">
            {departments.map((department) => (
              <div key={department} className="flex items-center space-x-2">
                <Checkbox
                  checked={isDepartmentSelected(department)}
                  onCheckedChange={(checked) => handleDepartmentChange(department, checked)}
                />
                <Label className="text-sm">{department}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium mb-2 block">Date Range</Label>
          <div className="space-y-2">
            <div>
              <Label className="text-xs mb-1 block">From</Label>
              <DatePicker
                date={startDate}
                onSelect={handleStartDateChange}
                placeholder="Start date"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">To</Label>
              <DatePicker
                date={endDate}
                onSelect={handleEndDateChange}
                placeholder="End date"
              />
            </div>
            <div className="flex flex-wrap gap-1 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyDatePreset('last7days')}
                className="text-xs"
              >
                Last 7 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyDatePreset('last30days')}
                className="text-xs"
              >
                Last 30 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyDatePreset('thisMonth')}
                className="text-xs"
              >
                This month
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAFilters;
