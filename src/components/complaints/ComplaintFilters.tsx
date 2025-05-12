
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, FilterX, Filter } from 'lucide-react';

const formatEnumValue = (value: string): string => {
  return value.replace(/_/g, ' ');
};

const filterFormSchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  searchTerm: z.string().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

interface ComplaintFiltersProps {
  onFilterChange: (filters: any) => void;
  onFilterClear: () => void;
}

export function ComplaintFilters({ onFilterChange, onFilterClear }: ComplaintFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      status: '',
      category: '',
      priority: '',
      searchTerm: '',
    },
  });

  function onSubmit(data: FilterFormValues) {
    const filters: any = {};
    
    if (data.status) filters.status = data.status;
    if (data.category) filters.category = data.category;
    if (data.priority) filters.priority = data.priority;
    if (data.searchTerm) filters.searchTerm = data.searchTerm;
    
    if (data.dateRange?.from && data.dateRange?.to) {
      filters.dateRange = {
        start: data.dateRange.from.toISOString(),
        end: data.dateRange.to.toISOString(),
      };
    }
    
    onFilterChange(filters);
  }
  
  const handleClear = () => {
    form.reset();
    onFilterClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Complaint Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {/* Search term - always visible */}
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search complaints by title, description or customer"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Filter
              </Button>
              <Button variant="outline" onClick={handleClear} className="flex items-center">
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Accordion
            type="single"
            collapsible
            value={isExpanded ? 'filters' : ''}
            onValueChange={(value) => setIsExpanded(!!value)}
          >
            <AccordionItem value="filters" className="border-0">
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {/* Status filter */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            {Object.values(ComplaintStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {formatEnumValue(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category filter */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Categories</SelectItem>
                            {Object.values(ComplaintCategory).map((category) => (
                              <SelectItem key={category} value={category}>
                                {formatEnumValue(category)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Priority filter */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All Priorities" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">All Priorities</SelectItem>
                            {Object.values(ComplaintPriority).map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date range picker */}
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>Date Range</FormLabel>
                        <FormControl>
                          <DateRangePicker
                            value={field.value || undefined}
                            onChange={field.onChange}
                            placeholder="Select a date range"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
    </div>
  );
}

export default ComplaintFilters;
