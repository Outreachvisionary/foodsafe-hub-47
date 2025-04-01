
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useSupplierRiskAssessment } from '@/hooks/useSupplierRiskAssessment';
import { useSuppliers } from '@/hooks/useSuppliers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const SupplierRiskAssessment = () => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const { assessments, statistics, isLoading, createRiskAssessment } = useSupplierRiskAssessment(selectedSupplierId || undefined);
  const { suppliers, isLoading: suppliersLoading } = useSuppliers();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [submitting, setSubmitting] = useState(false);
  
  const [formState, setFormState] = useState({
    supplier_id: '',
    food_safety_score: 80,
    quality_system_score: 75,
    regulatory_score: 90,
    delivery_score: 85,
    traceability_score: 70,
    notes: '',
    next_assessment_date: ''
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmitAssessment = async () => {
    try {
      if (!formState.supplier_id) {
        toast.error('Please select a supplier');
        return;
      }
      
      setSubmitting(true);
      console.log("Submitting assessment:", formState);
      
      await createRiskAssessment({
        ...formState,
        food_safety_score: Number(formState.food_safety_score),
        quality_system_score: Number(formState.quality_system_score),
        regulatory_score: Number(formState.regulatory_score),
        delivery_score: Number(formState.delivery_score),
        traceability_score: Number(formState.traceability_score),
      });
      
      toast.success('Risk assessment submitted successfully');
      
      setFormState({
        supplier_id: '',
        food_safety_score: 80,
        quality_system_score: 75,
        regulatory_score: 90,
        delivery_score: 85,
        traceability_score: 70,
        notes: '',
        next_assessment_date: ''
      });
      
      setSelectedTab('dashboard');
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to create risk assessment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const COLORS = ['#ef4444', '#f97316', '#22c55e'];
  
  const chartData = [
    { name: 'High Risk', value: statistics.highRiskCount, color: '#ef4444' },
    { name: 'Medium Risk', value: statistics.mediumRiskCount, color: '#f97316' },
    { name: 'Low Risk', value: statistics.lowRiskCount, color: '#22c55e' }
  ].filter(item => item.value > 0);
  
  // Get supplier name from id
  const getSupplierName = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Unknown Supplier';
  };
  
  return (
    <div>
      <Tabs 
        defaultValue="dashboard" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="assessments">Risk Assessments</TabsTrigger>
          <TabsTrigger value="new">New Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">Risk Distribution</CardTitle>
                <CardDescription>Supplier risk assessment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-500">No assessment data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                    High Risk Suppliers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statistics.highRiskCount}</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Suppliers requiring immediate attention
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-orange-500" />
                    Medium Risk Suppliers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statistics.mediumRiskCount}</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Suppliers requiring monitoring
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    Low Risk Suppliers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statistics.lowRiskCount}</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Suppliers meeting all requirements
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Total Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statistics.totalAssessments}</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Risk assessments performed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Risk Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin h-6 w-6 border-4 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : assessments.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {assessments.slice(0, 5).map((assessment) => (
                      <div key={assessment.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">
                            {assessment.suppliers?.name || 'Supplier'}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assessment.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                            assessment.risk_level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assessment.risk_level} Risk
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Overall Score</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.overall_score}
                                className="h-2 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-sm font-medium">{assessment.overall_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Assessment Date</p>
                            <p className="text-sm font-medium">
                              {new Date(assessment.assessment_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Food Safety</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.food_safety_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.food_safety_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Quality System</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.quality_system_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.quality_system_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Regulatory</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.regulatory_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.regulatory_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Delivery</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.delivery_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.delivery_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Traceability</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.traceability_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.traceability_score}%</span>
                            </div>
                          </div>
                        </div>
                        
                        {assessment.notes && (
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm bg-gray-50 p-2 rounded">{assessment.notes}</p>
                          </div>
                        )}
                        
                        {assessment.next_assessment_date && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Next Assessment: 
                              <span className="font-medium ml-1">
                                {new Date(assessment.next_assessment_date).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No risk assessments available</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setSelectedTab('new')}
                  >
                    Create Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">All Risk Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin h-6 w-6 border-4 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : assessments.length > 0 ? (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    {assessments.map((assessment) => (
                      <div key={assessment.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">
                            {assessment.suppliers?.name || 'Supplier'}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assessment.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                            assessment.risk_level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assessment.risk_level} Risk
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Overall Score</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.overall_score}
                                className="h-2 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-sm font-medium">{assessment.overall_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Assessment Date</p>
                            <p className="text-sm font-medium">
                              {new Date(assessment.assessment_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Food Safety</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.food_safety_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.food_safety_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Quality System</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.quality_system_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.quality_system_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Regulatory</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.regulatory_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.regulatory_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Delivery</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.delivery_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.delivery_score}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground">Traceability</p>
                            <div className="flex items-center mt-1">
                              <Progress
                                value={assessment.traceability_score}
                                className="h-1.5 w-full bg-gray-200"
                              />
                              <span className="ml-2 text-xs">{assessment.traceability_score}%</span>
                            </div>
                          </div>
                        </div>
                        
                        {assessment.notes && (
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm bg-gray-50 p-2 rounded">{assessment.notes}</p>
                          </div>
                        )}
                        
                        {assessment.next_assessment_date && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Next Assessment: 
                              <span className="font-medium ml-1">
                                {new Date(assessment.next_assessment_date).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No risk assessments available</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setSelectedTab('new')}
                  >
                    Create Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">New Risk Assessment</CardTitle>
              <CardDescription>
                Evaluate a supplier's risk profile across key performance areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select 
                    value={formState.supplier_id} 
                    onValueChange={(value) => handleInputChange('supplier_id', value)}
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliersLoading ? (
                        <div className="p-2 text-center">Loading suppliers...</div>
                      ) : suppliers.length > 0 ? (
                        suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-center">No suppliers found</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="food_safety">Food Safety Score: {formState.food_safety_score}</Label>
                      <span className="text-sm text-muted-foreground">{formState.food_safety_score}%</span>
                    </div>
                    <Input
                      id="food_safety"
                      type="range"
                      min="0"
                      max="100"
                      value={formState.food_safety_score}
                      onChange={(e) => handleInputChange('food_safety_score', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="quality_system">Quality System Score: {formState.quality_system_score}</Label>
                      <span className="text-sm text-muted-foreground">{formState.quality_system_score}%</span>
                    </div>
                    <Input
                      id="quality_system"
                      type="range"
                      min="0"
                      max="100"
                      value={formState.quality_system_score}
                      onChange={(e) => handleInputChange('quality_system_score', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="regulatory">Regulatory Score: {formState.regulatory_score}</Label>
                      <span className="text-sm text-muted-foreground">{formState.regulatory_score}%</span>
                    </div>
                    <Input
                      id="regulatory"
                      type="range"
                      min="0"
                      max="100"
                      value={formState.regulatory_score}
                      onChange={(e) => handleInputChange('regulatory_score', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="delivery">Delivery Score: {formState.delivery_score}</Label>
                      <span className="text-sm text-muted-foreground">{formState.delivery_score}%</span>
                    </div>
                    <Input
                      id="delivery"
                      type="range"
                      min="0"
                      max="100"
                      value={formState.delivery_score}
                      onChange={(e) => handleInputChange('delivery_score', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="traceability">Traceability Score: {formState.traceability_score}</Label>
                      <span className="text-sm text-muted-foreground">{formState.traceability_score}%</span>
                    </div>
                    <Input
                      id="traceability"
                      type="range"
                      min="0"
                      max="100"
                      value={formState.traceability_score}
                      onChange={(e) => handleInputChange('traceability_score', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="next_assessment_date">Next Assessment Date</Label>
                  <Input
                    id="next_assessment_date"
                    type="date"
                    value={formState.next_assessment_date}
                    onChange={(e) => handleInputChange('next_assessment_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional observations or notes about this supplier's risk assessment"
                    value={formState.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button 
                  onClick={handleSubmitAssessment}
                  className="w-full"
                  disabled={submitting || !formState.supplier_id}
                >
                  {submitting ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    'Submit Assessment'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierRiskAssessment;
