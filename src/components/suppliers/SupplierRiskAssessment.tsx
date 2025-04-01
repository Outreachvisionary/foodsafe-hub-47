
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight, BarChart3, Shield, Calendar, Activity } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupplierRiskAssessment } from '@/hooks/useSupplierRiskAssessment';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

// Risk factors defined
const riskFactorsData = [
  { factor: 'Prior audits with critical findings', weight: 10, description: 'Supplier has history of critical audit findings' },
  { factor: 'Supplying high-risk ingredients', weight: 8, description: 'Ingredients prone to contamination or adulteration' },
  { factor: 'History of recalls or withdrawals', weight: 9, description: 'Previous product recalls or market withdrawals' },
  { factor: 'Geographical risk factors', weight: 7, description: 'Location with known environmental or political risks' },
  { factor: 'Compliance with documentation', weight: 6, description: 'Timeliness and accuracy of required documentation' },
];

const SupplierRiskAssessment: React.FC = () => {
  const isMobile = useIsMobile();
  const { assessments, statistics, isLoading, createRiskAssessment } = useSupplierRiskAssessment();
  const { suppliers } = useSuppliers();
  const [isNewAssessmentDialogOpen, setIsNewAssessmentDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [nextAssessmentDate, setNextAssessmentDate] = useState<string>('');
  const [scores, setScores] = useState({
    foodSafety: 80,
    qualitySystem: 75,
    regulatory: 85,
    delivery: 70,
    traceability: 80
  });

  // Prepare data for charts
  const categoryScores = assessments.length > 0 ? [
    { category: 'Food Safety', score: assessments[0].food_safety_score },
    { category: 'Quality System', score: assessments[0].quality_system_score },
    { category: 'Regulatory', score: assessments[0].regulatory_score },
    { category: 'Delivery', score: assessments[0].delivery_score },
    { category: 'Traceability', score: assessments[0].traceability_score },
  ] : [];

  const distributionData = [
    { name: 'High Risk', value: statistics.highRiskCount },
    { name: 'Medium Risk', value: statistics.mediumRiskCount },
    { name: 'Low Risk', value: statistics.lowRiskCount },
  ];

  const handleScoreChange = (category: string, value: number[]) => {
    setScores(prev => ({ ...prev, [category]: value[0] }));
  };

  const handleCreateAssessment = async () => {
    if (!selectedSupplier) {
      return;
    }

    try {
      await createRiskAssessment({
        supplier_id: selectedSupplier,
        food_safety_score: scores.foodSafety,
        quality_system_score: scores.qualitySystem,
        regulatory_score: scores.regulatory,
        delivery_score: scores.delivery,
        traceability_score: scores.traceability,
        notes: notes,
        next_assessment_date: nextAssessmentDate || undefined
      });
      
      // Reset form
      setSelectedSupplier('');
      setNotes('');
      setNextAssessmentDate('');
      setScores({
        foodSafety: 80,
        qualitySystem: 75,
        regulatory: 85,
        delivery: 70,
        traceability: 80
      });
      
      setIsNewAssessmentDialogOpen(false);
    } catch (error) {
      console.error('Error creating assessment:', error);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Risk Assessment Overview
            </CardTitle>
            <CardDescription>
              Evaluate supplier risks across multiple criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center h-80 items-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : categoryScores.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryScores}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="category" fontSize={12} />
                    <YAxis domain={[0, 100]} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="score" 
                      name="Risk Score"
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center h-80 items-center text-gray-500">
                No risk assessment data available
              </div>
            )}
            
            {categoryScores.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Risk Category Breakdown</h3>
                <div className="space-y-3">
                  {categoryScores.map((item) => (
                    <div key={item.category} className="flex items-center">
                      <div className="w-28 shrink-0 text-sm">{item.category}</div>
                      <div className="flex-grow mx-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.score > 80 ? 'bg-green-500' : 
                              item.score > 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm font-medium">{item.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Supplier Risk Distribution
            </CardTitle>
            <CardDescription>
              Overview of risk levels across all suppliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center h-80 items-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : statistics.totalAssessments > 0 ? (
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} suppliers`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex justify-center h-80 items-center text-gray-500">
                No risk assessment data available
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-green-50 rounded-md">
                <div className="text-xl font-bold text-green-600">
                  {statistics.lowRiskCount > 0 ? (
                    `${Math.round(statistics.lowRiskCount / statistics.totalAssessments * 100)}%`
                  ) : '0%'}
                </div>
                <div className="text-xs text-center text-green-700">Low Risk</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-md">
                <div className="text-xl font-bold text-yellow-600">
                  {statistics.mediumRiskCount > 0 ? (
                    `${Math.round(statistics.mediumRiskCount / statistics.totalAssessments * 100)}%`
                  ) : '0%'}
                </div>
                <div className="text-xs text-center text-yellow-700">Medium Risk</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-red-50 rounded-md">
                <div className="text-xl font-bold text-red-600">
                  {statistics.highRiskCount > 0 ? (
                    `${Math.round(statistics.highRiskCount / statistics.totalAssessments * 100)}%`
                  ) : '0%'}
                </div>
                <div className="text-xs text-center text-red-700">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Risk Factors & Weighting
          </CardTitle>
          <CardDescription>
            Key factors used in supplier risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium text-gray-700">Risk Factor</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-700">Weight</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {riskFactorsData.map((factor, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{factor.factor}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px] mr-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${factor.weight * 10}%` }}
                          ></div>
                        </div>
                        <span>{factor.weight}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{factor.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 sm:mb-0">
              Risk assessments are updated quarterly and upon significant supplier changes
            </p>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Assessment
              </Button>
              <Button onClick={() => setIsNewAssessmentDialogOpen(true)}>
                <Activity className="mr-2 h-4 w-4" />
                Start New Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>High-Risk Suppliers Requiring Immediate Attention</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments
                .filter(a => a.risk_level === 'High')
                .slice(0, 3)
                .map(assessment => (
                  <div key={assessment.id} className="border border-red-200 bg-red-50 rounded-md p-4">
                    <h3 className="font-medium flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                      {assessment.suppliers?.name || 'Unknown Supplier'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Risk Score: {assessment.overall_score}/100</p>
                    <div className="mt-2 text-sm">
                      <p className="text-red-700 font-medium">Critical Issues:</p>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        {assessment.food_safety_score < 70 && <li>Food safety concerns identified</li>}
                        {assessment.quality_system_score < 70 && <li>Quality system deficiencies</li>}
                        {assessment.regulatory_score < 70 && <li>Regulatory compliance issues</li>}
                        {assessment.delivery_score < 70 && <li>Delivery performance problems</li>}
                        {assessment.traceability_score < 70 && <li>Traceability gaps identified</li>}
                      </ul>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full text-red-600 border-red-200">
                      View Assessment <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              
              {assessments.filter(a => a.risk_level === 'High').length === 0 && (
                <div className="col-span-3 text-center py-6 text-gray-500">
                  No high-risk suppliers found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Risk Assessment Dialog */}
      <Dialog open={isNewAssessmentDialogOpen} onOpenChange={setIsNewAssessmentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Risk Assessment</DialogTitle>
            <DialogDescription>
              Evaluate a supplier across multiple risk categories
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Food Safety Score: {scores.foodSafety}</Label>
                  <span className={`text-xs font-medium ${
                    scores.foodSafety >= 80 ? 'text-green-600' : 
                    scores.foodSafety >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {scores.foodSafety >= 80 ? 'Low Risk' : 
                     scores.foodSafety >= 60 ? 'Medium Risk' : 
                     'High Risk'}
                  </span>
                </div>
                <Slider
                  defaultValue={[scores.foodSafety]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleScoreChange('foodSafety', value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Quality System Score: {scores.qualitySystem}</Label>
                  <span className={`text-xs font-medium ${
                    scores.qualitySystem >= 80 ? 'text-green-600' : 
                    scores.qualitySystem >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {scores.qualitySystem >= 80 ? 'Low Risk' : 
                     scores.qualitySystem >= 60 ? 'Medium Risk' : 
                     'High Risk'}
                  </span>
                </div>
                <Slider
                  defaultValue={[scores.qualitySystem]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleScoreChange('qualitySystem', value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Regulatory Score: {scores.regulatory}</Label>
                  <span className={`text-xs font-medium ${
                    scores.regulatory >= 80 ? 'text-green-600' : 
                    scores.regulatory >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {scores.regulatory >= 80 ? 'Low Risk' : 
                     scores.regulatory >= 60 ? 'Medium Risk' : 
                     'High Risk'}
                  </span>
                </div>
                <Slider
                  defaultValue={[scores.regulatory]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleScoreChange('regulatory', value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Delivery Score: {scores.delivery}</Label>
                  <span className={`text-xs font-medium ${
                    scores.delivery >= 80 ? 'text-green-600' : 
                    scores.delivery >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {scores.delivery >= 80 ? 'Low Risk' : 
                     scores.delivery >= 60 ? 'Medium Risk' : 
                     'High Risk'}
                  </span>
                </div>
                <Slider
                  defaultValue={[scores.delivery]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleScoreChange('delivery', value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Traceability Score: {scores.traceability}</Label>
                  <span className={`text-xs font-medium ${
                    scores.traceability >= 80 ? 'text-green-600' : 
                    scores.traceability >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {scores.traceability >= 80 ? 'Low Risk' : 
                     scores.traceability >= 60 ? 'Medium Risk' : 
                     'High Risk'}
                  </span>
                </div>
                <Slider
                  defaultValue={[scores.traceability]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleScoreChange('traceability', value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nextAssessmentDate">Next Assessment Date (Optional)</Label>
              <Input 
                id="nextAssessmentDate" 
                type="date" 
                value={nextAssessmentDate} 
                onChange={e => setNextAssessmentDate(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Additional information" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAssessmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAssessment}
              disabled={!selectedSupplier}
            >
              Create Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierRiskAssessment;
