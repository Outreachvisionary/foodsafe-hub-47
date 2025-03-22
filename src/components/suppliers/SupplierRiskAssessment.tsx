
import React from 'react';
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

// Sample data for risk categories
const riskCategoryData = [
  { category: 'Food Safety', score: 85 },
  { category: 'Quality System', score: 78 },
  { category: 'Regulatory', score: 92 },
  { category: 'Delivery', score: 65 },
  { category: 'Traceability', score: 88 },
];

// Sample data for supplier risk levels
const supplierRiskData = [
  { name: 'High Risk', value: 12 },
  { name: 'Medium Risk', value: 25 },
  { name: 'Low Risk', value: 63 },
];

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

// Sample data for risk factors
const riskFactorsData = [
  { factor: 'Prior audits with critical findings', weight: 10, description: 'Supplier has history of critical audit findings' },
  { factor: 'Supplying high-risk ingredients', weight: 8, description: 'Ingredients prone to contamination or adulteration' },
  { factor: 'History of recalls or withdrawals', weight: 9, description: 'Previous product recalls or market withdrawals' },
  { factor: 'Geographical risk factors', weight: 7, description: 'Location with known environmental or political risks' },
  { factor: 'Compliance with documentation', weight: 6, description: 'Timeliness and accuracy of required documentation' },
];

const SupplierRiskAssessment: React.FC = () => {
  const isMobile = useIsMobile();
  
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskCategoryData}
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
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Risk Category Breakdown</h3>
              <div className="space-y-3">
                {riskCategoryData.map((item) => (
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
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supplierRiskData}
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
                    {supplierRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} suppliers`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-green-50 rounded-md">
                <div className="text-xl font-bold text-green-600">63%</div>
                <div className="text-xs text-center text-green-700">Low Risk</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-md">
                <div className="text-xl font-bold text-yellow-600">25%</div>
                <div className="text-xs text-center text-yellow-700">Medium Risk</div>
              </div>
              <div className="flex flex-col items-center p-2 bg-red-50 rounded-md">
                <div className="text-xl font-bold text-red-600">12%</div>
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
              <Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-red-200 bg-red-50 rounded-md p-4">
              <h3 className="font-medium flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                Global Ingredients Ltd.
              </h3>
              <p className="text-sm text-gray-600 mt-1">Risk Score: 76/100</p>
              <div className="mt-2 text-sm">
                <p className="text-red-700 font-medium">Critical Issues:</p>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>Recent audit revealed HACCP non-conformances</li>
                  <li>Two product holds in last quarter</li>
                </ul>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full text-red-600 border-red-200">
                View Assessment <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            
            <div className="border border-red-200 bg-red-50 rounded-md p-4">
              <h3 className="font-medium flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                FreshCrop Farms
              </h3>
              <p className="text-sm text-gray-600 mt-1">Risk Score: 72/100</p>
              <div className="mt-2 text-sm">
                <p className="text-red-700 font-medium">Critical Issues:</p>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>Pesticide residue exceeding limits</li>
                  <li>Incomplete traceability records</li>
                </ul>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full text-red-600 border-red-200">
                View Assessment <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            
            <div className="border border-yellow-200 bg-yellow-50 rounded-md p-4">
              <h3 className="font-medium flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                QuickShip Logistics
              </h3>
              <p className="text-sm text-gray-600 mt-1">Risk Score: 83/100</p>
              <div className="mt-2 text-sm">
                <p className="text-yellow-700 font-medium">Issues:</p>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>Temperature excursions during transit</li>
                  <li>Delayed delivery performance</li>
                </ul>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full text-yellow-600 border-yellow-200">
                View Assessment <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierRiskAssessment;
