
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Printer, FileDown, Mail, FileText } from 'lucide-react';

const reportSchema = z.object({
  reportType: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  productCategory: z.string().optional(),
  includeRawMaterials: z.boolean().default(false),
  includeGraphs: z.boolean().default(true),
  format: z.enum(['pdf', 'excel', 'csv']),
  recipients: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const TraceabilityReports: React.FC = () => {
  const [generatedReports, setGeneratedReports] = useState<any[]>([
    { 
      id: '1', 
      name: 'Q1 Recall Summary', 
      type: 'Recall Summary', 
      date: '2025-04-01', 
      format: 'PDF',
      generatedBy: 'System Admin'
    },
    { 
      id: '2', 
      name: 'March Product Traceability', 
      type: 'Product Traceability', 
      date: '2025-03-22', 
      format: 'Excel',
      generatedBy: 'John Smith'
    },
    { 
      id: '3', 
      name: 'Dairy Products Genealogy', 
      type: 'Product Genealogy', 
      date: '2025-02-15', 
      format: 'PDF',
      generatedBy: 'Jane Doe'
    },
  ]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: '',
      startDate: '',
      endDate: '',
      productCategory: '',
      includeRawMaterials: false,
      includeGraphs: true,
      format: 'pdf',
      recipients: '',
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    console.log('Generating report with:', data);
    // In a real application, this would call an API to generate the report
    const newReport = {
      id: (generatedReports.length + 1).toString(),
      name: `${data.reportType} - ${new Date().toLocaleDateString()}`,
      type: data.reportType,
      date: new Date().toISOString().split('T')[0],
      format: data.format.toUpperCase(),
      generatedBy: 'Current User',
    };
    setGeneratedReports([newReport, ...generatedReports]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
          <CardDescription>
            Create custom reports to share with management and stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Recall Summary">Recall Summary</SelectItem>
                        <SelectItem value="Product Traceability">Product Traceability</SelectItem>
                        <SelectItem value="Raw Material Usage">Raw Material Usage</SelectItem>
                        <SelectItem value="Recall Simulations">Recall Simulations</SelectItem>
                        <SelectItem value="Product Genealogy">Product Genealogy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category (Optional)</FormLabel>
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
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="produce">Produce</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="includeRawMaterials"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Raw Materials</FormLabel>
                        <FormDescription>
                          Include details about raw materials used in products
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeGraphs"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Graphs and Charts</FormLabel>
                        <FormDescription>
                          Add visual representations of data in the report
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Format</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Recipients (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@example.com, another@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Separate multiple email addresses with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Generate Report</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>
            Access and manage your previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedReports.length > 0 ? (
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>By {report.generatedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge>{report.format}</Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reports have been generated yet.
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {generatedReports.length} reports
          </div>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TraceabilityReports;
