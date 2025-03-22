
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ClipboardList, 
  FileCheck, 
  FilePenLine, 
  ClipboardCheck, 
  AlertOctagon 
} from 'lucide-react';

const SupplierApproval: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" />
            Supplier Approval Workflow
          </CardTitle>
          <CardDescription>
            Streamline the onboarding process for new suppliers with our automated approval workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            {/* Step 1: Initial Registration */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
              <FilePenLine className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Initial Registration</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Supplier completes registration form with basic information</p>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ArrowRight className="h-3 w-3 md:mr-1" />
                  <span className="hidden md:inline">Next</span>
                </Button>
              </div>
            </div>
            
            {/* Step 2: Document Collection */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
              <FileCheck className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Document Collection</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Upload certificates, audit reports, and regulatory documents</p>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ArrowRight className="h-3 w-3 md:mr-1" />
                  <span className="hidden md:inline">Next</span>
                </Button>
              </div>
            </div>
            
            {/* Step 3: Risk Assessment */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
              <AlertOctagon className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Risk Assessment</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Evaluate potential risks and determine assessment requirements</p>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ArrowRight className="h-3 w-3 md:mr-1" />
                  <span className="hidden md:inline">Next</span>
                </Button>
              </div>
            </div>
            
            {/* Step 4: Review & Approval */}
            <div className="bg-gray-50 border rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
              <ClipboardCheck className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium text-sm md:text-base">Review & Approval</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Quality team reviews documents and risk assessment results</p>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ArrowRight className="h-3 w-3 md:mr-1" />
                  <span className="hidden md:inline">Next</span>
                </Button>
              </div>
            </div>
            
            {/* Step 5: Onboarding Complete */}
            <div className="bg-gray-50 border border-green-200 rounded-md p-4 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</div>
              <FileCheck className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-medium text-sm md:text-base">Onboarding Complete</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Supplier approved and added to the approved supplier list</p>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="text-xs text-green-600 border-green-200">
                  <span>Complete</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Button>
              Start New Approval Process
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Approval Processes</CardTitle>
          <CardDescription>Track ongoing supplier approval workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Natural Flavors Inc.</h3>
                  <p className="text-sm text-gray-500">Started: May 12, 2023</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs">Stage 2: Document Collection</div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Sustainable Packaging Co.</h3>
                  <p className="text-sm text-gray-500">Started: May 8, 2023</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs">Stage 3: Risk Assessment</div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">GreenGrow Organic Farms</h3>
                  <p className="text-sm text-gray-500">Started: May 5, 2023</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs">Stage 4: Review & Approval</div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierApproval;
