
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComplianceCategory {
  title: string;
  percentage: number;
}

interface OverallComplianceCardProps {
  compliancePercentage?: number;
  totalAssigned?: number;
  completed?: number;
}

const OverallComplianceCard: React.FC<OverallComplianceCardProps> = ({ 
  compliancePercentage: externalPercentage,
  totalAssigned: externalTotal,
  completed: externalCompleted
}) => {
  const [compliancePercentage, setCompliancePercentage] = useState(externalPercentage || 0);
  const [totalAssigned, setTotalAssigned] = useState(externalTotal || 0);
  const [completed, setCompleted] = useState(externalCompleted || 0);
  const [categories, setCategories] = useState<ComplianceCategory[]>([]);
  const [loading, setLoading] = useState(externalPercentage === undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (externalPercentage !== undefined) {
      setCompliancePercentage(externalPercentage);
      setTotalAssigned(externalTotal || 0);
      setCompleted(externalCompleted || 0);
    } else {
      fetchComplianceData();
    }
  }, [externalPercentage, externalTotal, externalCompleted]);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      
      // Get all training records
      const { data: records, error } = await supabase
        .from('training_records')
        .select('*');
        
      if (error) throw error;
      
      if (!records || records.length === 0) {
        setCompliancePercentage(0);
        setTotalAssigned(0);
        setCompleted(0);
        setCategories([]);
        setLoading(false);
        return;
      }
      
      // Calculate overall compliance metrics
      const total = records.length;
      const completedCount = records.filter(r => r.status === 'Completed').length;
      const compliancePercent = Math.round((completedCount / total) * 100) || 0;
      
      setTotalAssigned(total);
      setCompleted(completedCount);
      setCompliancePercentage(compliancePercent);
      
      // Get training sessions to group by category
      const { data: sessions, error: sessionsError } = await supabase
        .from('training_sessions')
        .select('id, training_category');
        
      if (sessionsError) throw sessionsError;
      
      // Create a map of session IDs to categories
      const sessionCategories: Record<string, string> = {};
      for (const session of (sessions || [])) {
        if (session.id && session.training_category) {
          sessionCategories[session.id] = session.training_category;
        }
      }
      
      // Group records by training category
      const categoryGroups: Record<string, { total: number; completed: number }> = {};
      
      for (const record of records) {
        const category = sessionCategories[record.session_id] || 'Uncategorized';
        
        if (!categoryGroups[category]) {
          categoryGroups[category] = { total: 0, completed: 0 };
        }
        
        categoryGroups[category].total++;
        
        if (record.status === 'Completed') {
          categoryGroups[category].completed++;
        }
      }
      
      // Calculate compliance percentage for each category
      const categoryData: ComplianceCategory[] = Object.entries(categoryGroups)
        .map(([title, data]) => ({
          title,
          percentage: Math.round((data.completed / data.total) * 100) || 0
        }))
        .filter(cat => cat.title !== 'Uncategorized')
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 3);
      
      setCategories(categoryData);
    } catch (err) {
      console.error('Error fetching compliance data:', err);
      toast({
        title: 'Error',
        description: 'Failed to load compliance data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 85) return 'Good';
    if (percentage >= 70) return 'Needs Improvement';
    return 'Critical';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
          Overall Training Compliance
        </CardTitle>
        <CardDescription>Training completion across the organization</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{compliancePercentage}%</span>
              <span className={`font-medium ${getComplianceColor(compliancePercentage)}`}>
                {getComplianceStatus(compliancePercentage)}
              </span>
            </div>
            
            <Progress value={compliancePercentage} className="h-2" />
            
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">
                {completed} of {totalAssigned} trainings completed
              </span>
              <span className="text-muted-foreground">
                Target: 90%
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <ComplianceCategory 
                    key={index}
                    title={category.title} 
                    percentage={category.percentage} 
                  />
                ))
              ) : (
                <>
                  <ComplianceCategory title="No Data" percentage={0} />
                  <ComplianceCategory title="No Data" percentage={0} />
                  <ComplianceCategory title="No Data" percentage={0} />
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ComplianceCategoryProps {
  title: string;
  percentage: number;
}

const ComplianceCategory: React.FC<ComplianceCategoryProps> = ({ title, percentage }) => {
  const getColorClass = (value: number) => {
    if (value >= 85) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="text-center">
      <h4 className="text-sm font-medium mb-1">{title}</h4>
      <div className={`text-lg font-bold ${getColorClass(percentage)}`}>
        {percentage}%
      </div>
    </div>
  );
};

export default OverallComplianceCard;
