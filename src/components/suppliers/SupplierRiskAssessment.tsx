
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { CalendarIcon, Shield, AlertTriangle, CheckCircle2, Info, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupplierRiskAssessment, RiskAssessment } from '@/hooks/useSupplierRiskAssessment';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useForm } from 'react-hook-form';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SupplierRiskAssessment = () => {
  const { assessments, statistics, isLoading, createRiskAssessment } = useSupplierRiskAssessment();
  const { suppliers } = useSuppliers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      supplierId: '',
      foodSafetyScore: 80,
      qualitySystemScore: 80,
      regulatoryScore: 80,
      deliveryScore: 80,
      traceabilityScore: 80,
      notes: '',
      nextAssessmentDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      await createRiskAssessment({
        supplier_id: values.supplierId,
        food_safety_score: values.foodSafetyScore,
        quality_system_score: values.qualitySystemScore,
        regulatory_score: values.regulatoryScore,
        delivery_score: values.deliveryScore,
        traceability_score: values.traceabilityScore,
        notes: values.notes,
        next_assessment_date: values.nextAssessmentDate.toISOString(),
      });
      
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating risk assessment:', error);
    }
  };
  
  const viewAssessmentDetails = (assessment: RiskAssessment) => {
    setSelectedAssessment(assessment);
    setIsDetailsDialogOpen(true);
  };
  
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-2xl font-bold">{statistics.highRiskCount}</span>
              </div>
              <Badge className="bg-red-100 text-red-800">High</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Info className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">{statistics.mediumRiskCount}</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Risk Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{statistics.lowRiskCount}</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Low</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{statistics.totalAssessments}</span>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" /> New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New Risk Assessment</DialogTitle>
                    <DialogDescription>
                      Complete the form below to create a new supplier risk assessment.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Supplier</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a supplier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {suppliers.map((supplier) => (
                                  <SelectItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="foodSafetyScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Food Safety Score: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                Rate the supplier's food safety performance
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="qualitySystemScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quality System Score: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                Rate the supplier's quality management system
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="regulatoryScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Regulatory Compliance Score: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                Rate the supplier's regulatory compliance
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deliveryScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Performance Score: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                Rate the supplier's delivery reliability and performance
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="traceabilityScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Traceability Score: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                Rate the supplier's traceability systems and capabilities
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="nextAssessmentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Next Assessment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date > new Date("2100-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              When the next assessment should be conducted
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter any additional notes or observations about the supplier's risk assessment"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Submit Assessment</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Risk Assessment History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Assessment Date</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Assessed By</TableHead>
                  <TableHead>Next Assessment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.length > 0 ? (
                  assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">
                        {assessment.supplier_id}
                      </TableCell>
                      <TableCell>
                        {new Date(assessment.assessment_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={getRiskLevelColor(assessment.risk_level)} 
                          variant="outline"
                        >
                          {assessment.risk_level}
                        </Badge>
                      </TableCell>
                      <TableCell className={getScoreColor(assessment.overall_score)}>
                        {assessment.overall_score}%
                      </TableCell>
                      <TableCell>{assessment.assessed_by}</TableCell>
                      <TableCell>
                        {assessment.next_assessment_date ? 
                          new Date(assessment.next_assessment_date).toLocaleDateString() : 
                          'Not scheduled'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewAssessmentDetails(assessment)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No risk assessments found. Create your first assessment!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Risk Assessment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Risk Assessment Details</DialogTitle>
            <DialogDescription>
              View complete information about this risk assessment
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssessment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Supplier:</span>
                      <span className="col-span-2 font-medium">{selectedAssessment.supplier_id}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Assessment Date:</span>
                      <span className="col-span-2">
                        {new Date(selectedAssessment.assessment_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Assessed By:</span>
                      <span className="col-span-2">{selectedAssessment.assessed_by}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Risk Level:</span>
                      <span className="col-span-2">
                        <Badge className={getRiskLevelColor(selectedAssessment.risk_level)}>
                          {selectedAssessment.risk_level}
                        </Badge>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500">Next Assessment:</span>
                      <span className="col-span-2">
                        {selectedAssessment.next_assessment_date ? 
                          new Date(selectedAssessment.next_assessment_date).toLocaleDateString() : 
                          'Not scheduled'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Progress 
                        value={selectedAssessment.overall_score} 
                        className="h-4"
                        indicatorClassName={
                          selectedAssessment.overall_score >= 85 ? "bg-green-500" :
                          selectedAssessment.overall_score >= 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        }
                      />
                    </div>
                    <div className="text-2xl font-bold">
                      {selectedAssessment.overall_score}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Detailed Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Food Safety</span>
                        <span className={getScoreColor(selectedAssessment.food_safety_score)}>
                          {selectedAssessment.food_safety_score}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedAssessment.food_safety_score} 
                        className="h-2"
                        indicatorClassName={
                          selectedAssessment.food_safety_score >= 85 ? "bg-green-500" :
                          selectedAssessment.food_safety_score >= 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Quality System</span>
                        <span className={getScoreColor(selectedAssessment.quality_system_score)}>
                          {selectedAssessment.quality_system_score}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedAssessment.quality_system_score} 
                        className="h-2"
                        indicatorClassName={
                          selectedAssessment.quality_system_score >= 85 ? "bg-green-500" :
                          selectedAssessment.quality_system_score >= 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Regulatory Compliance</span>
                        <span className={getScoreColor(selectedAssessment.regulatory_score)}>
                          {selectedAssessment.regulatory_score}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedAssessment.regulatory_score} 
                        className="h-2"
                        indicatorClassName={
                          selectedAssessment.regulatory_score >= 85 ? "bg-green-500" :
                          selectedAssessment.regulatory_score >= 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Delivery Performance</span>
                        <span className={getScoreColor(selectedAssessment.delivery_score)}>
                          {selectedAssessment.delivery_score}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedAssessment.delivery_score} 
                        className="h-2"
                        indicatorClassName={
                          selectedAssessment.delivery_score >= 85 ? "bg-green-500" :
                          selectedAssessment.delivery_score >= 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        }
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Traceability</span>
                        <span className={getScoreColor(selectedAssessment.traceability_score)}>
                          {selectedAssessment.traceability_score}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedAssessment.traceability_score} 
                        className="h-2"
                        indicatorClassName={
                          selectedAssessment.traceability_score >= 85 ? "bg-green-500" :
                          selectedAssessment.traceability_score >= 70 ? "bg-yellow-500" :
                          "bg-red-500"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedAssessment.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700">{selectedAssessment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierRiskAssessment;
