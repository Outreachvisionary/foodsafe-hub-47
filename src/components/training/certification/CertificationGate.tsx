
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Award, BookOpen, Lock } from 'lucide-react';
import { useCertification } from '@/hooks/use-certification';
import { toast } from '@/hooks/use-toast';

interface CertificationGateProps {
  certificationType: 'spc-basics' | 'spc-advanced' | 'quality-management' | 'compliance' | 'safety';
  children: React.ReactNode;
  requiredFor: string;
}

const CertificationGate: React.FC<CertificationGateProps> = ({ 
  certificationType, 
  children,
  requiredFor
}) => {
  const { isValid, expiryDate, isLoading, daysUntilExpiry } = useCertification(certificationType);
  
  // Mapping of certification types to display names and course IDs
  const certificationInfo = {
    'spc-basics': { 
      name: 'SPC Fundamentals', 
      courseId: 'COURSE004',
      description: 'Basic understanding of statistical process control methods and tools'
    },
    'spc-advanced': { 
      name: 'Advanced SPC', 
      courseId: 'COURSE006',
      description: 'Advanced techniques in statistical process control and process capability analysis'
    },
    'quality-management': { 
      name: 'Quality Management', 
      courseId: 'COURSE007',
      description: 'Quality management principles and practices'
    },
    'compliance': { 
      name: 'Compliance Training', 
      courseId: 'COURSE001',
      description: 'Regulatory compliance and standard requirements'
    },
    'safety': { 
      name: 'Safety Training', 
      courseId: 'COURSE002',
      description: 'Workplace safety procedures and protocols'
    }
  };
  
  const info = certificationInfo[certificationType];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isValid) {
    // If certification is valid, render the protected content
    return (
      <>
        {daysUntilExpiry && daysUntilExpiry < 30 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
              <div>
                <h4 className="font-medium text-amber-800">Certification Expiring Soon</h4>
                <p className="text-sm text-amber-700">
                  Your {info.name} certification expires in {daysUntilExpiry} days. 
                  Please complete the renewal course.
                </p>
              </div>
            </div>
          </div>
        )}
        {children}
      </>
    );
  }
  
  // If certification is not valid, show gate component
  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="h-5 w-5 text-amber-600 mr-2" />
          Certification Required
        </CardTitle>
        <CardDescription>
          You need {info.name} certification to access {requiredFor}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            This feature requires an active {info.name} certification. 
            Please complete the required training to gain access.
          </p>
          <div className="mb-6 w-full max-w-md">
            <div className="bg-white rounded-md p-4 border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Required Training
              </h4>
              <p className="text-sm mb-2">{info.description}</p>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => {
                  toast({
                    title: "Training Required",
                    description: `Redirecting to ${info.name} course...`,
                  });
                  // In a real app, this would navigate to the course
                  // navigate(`/training/courses/${info.courseId}`);
                }}
              >
                Go to Training Course
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-amber-50 border-t border-amber-200 flex justify-center">
        <p className="text-sm text-amber-700">
          Contact your training manager if you believe you already have this certification.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CertificationGate;
