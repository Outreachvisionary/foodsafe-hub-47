
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ExpiringCertification {
  id: string;
  name: string;
  employee: string;
  employeeId: string;
  expiryDate: string;
  daysLeft: number;
}

interface ExpiringCertificationsCardProps {
  count?: number;
  daysThreshold?: number;
}

const ExpiringCertificationsCard: React.FC<ExpiringCertificationsCardProps> = ({ 
  count = 4,
  daysThreshold = 45
}) => {
  const [expiringCertifications, setExpiringCertifications] = useState<ExpiringCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpiringCertifications();
  }, [count, daysThreshold]);

  const fetchExpiringCertifications = async () => {
    try {
      setLoading(true);
      
      // Calculate the date threshold for expiring certifications
      const expiryDateThreshold = new Date();
      expiryDateThreshold.setDate(expiryDateThreshold.getDate() + daysThreshold);
      
      // Query for training records with certifications expiring within the threshold
      const { data, error } = await supabase
        .from('training_records')
        .select(`
          id, 
          employee_id, 
          employee_name, 
          next_recurrence,
          session_id,
          training_sessions(title)
        `)
        .eq('status', 'Completed')
        .lt('next_recurrence', expiryDateThreshold.toISOString())
        .is('completion_date', 'not.null')
        .order('next_recurrence', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        setExpiringCertifications([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }
      
      setTotalCount(data.length);
      
      // Transform the data to the expected format
      const formattedData: ExpiringCertification[] = data.slice(0, count).map(item => {
        const expiryDate = new Date(item.next_recurrence);
        const now = new Date();
        const diffTime = expiryDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Fix how we access the title from the training_sessions relation
        // In Supabase, when selecting a foreign table with specific columns,
        // it returns the related data in a format that depends on the relation cardinality
        let sessionTitle = 'Unknown Training';
        
        if (item.training_sessions) {
          // For a one-to-one relation it returns an object
          if (!Array.isArray(item.training_sessions)) {
            sessionTitle = (item.training_sessions as { title: string }).title;
          } 
          // For a one-to-many relation it returns an array
          else if (Array.isArray(item.training_sessions) && item.training_sessions.length > 0) {
            sessionTitle = (item.training_sessions[0] as { title: string }).title;
          }
        }
        
        return {
          id: item.id,
          name: sessionTitle,
          employee: item.employee_name,
          employeeId: item.employee_id,
          expiryDate: expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          daysLeft: daysLeft
        };
      });
      
      setExpiringCertifications(formattedData);
    } catch (err) {
      console.error('Error fetching expiring certifications:', err);
      toast({
        title: 'Error',
        description: 'Failed to load expiring certifications.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (certId: string, employeeName: string) => {
    try {
      // Update the training record with a note about the reminder
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('training_records')
        .update({
          notes: `Recertification reminder sent on ${new Date().toLocaleDateString()}`
        })
        .eq('id', certId);
        
      if (error) throw error;
      
      toast({
        title: 'Reminder Sent',
        description: `Certification reminder sent to ${employeeName}`,
      });
    } catch (err) {
      console.error('Error sending reminder:', err);
      toast({
        title: 'Error',
        description: 'Failed to send reminder.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Award className="h-5 w-5 text-amber-500 mr-2" />
          Expiring Certifications
        </CardTitle>
        <CardDescription>Certifications expiring in the next {daysThreshold} days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : expiringCertifications.length > 0 ? (
          <div className="space-y-4">
            {expiringCertifications.map((cert) => (
              <div key={cert.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                {cert.daysLeft <= 14 ? (
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Calendar className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-grow">
                  <h4 className="text-sm font-medium">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground">{cert.employee}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">Expires: {cert.expiryDate}</span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${
                      cert.daysLeft <= 14 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {cert.daysLeft} days left
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleSendReminder(cert.id, cert.employee)}
                >
                  Remind
                </Button>
              </div>
            ))}
            
            {totalCount > count && (
              <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors w-full text-center">
                View all {totalCount} expiring certifications
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No expiring certifications found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringCertificationsCard;
