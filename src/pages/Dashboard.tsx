
import React from 'react';
import DashboardContent from '@/components/dashboard/DashboardOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import useProfileRealtime from '@/hooks/useProfileRealtime';
import { LayoutDashboard, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useUser();
  const { isListening } = useProfileRealtime();
  
  React.useEffect(() => {
    console.log('Dashboard mounted, user:', user?.email);
    console.log('Profile listener active:', isListening);
  }, [user, isListening]);
  
  // Get display name from user profile, safely
  const displayName = user?.displayName || user?.email?.split('@')[0] || '';
  
  return (
    <div className="container mx-auto space-y-8">
      {/* Header */}
      <motion.header 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-accent" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-foreground-secondary mt-1">
            Welcome back{displayName ? `, ${displayName}` : ''}. Here's your compliance overview.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span>View Alerts</span>
          </Button>
          <Button size="sm">
            <CheckCircle className="h-4 w-4" />
            <span>Run Compliance Check</span>
          </Button>
        </div>
      </motion.header>
      
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-accent-subtle">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mt-20 -mr-20" />
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-2xl font-display font-bold">
              Welcome to Compliance Core
            </CardTitle>
            <CardDescription className="text-base">
              Your comprehensive solution for food safety management and compliance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <p className="text-foreground/90 mb-4">
                  The dashboard provides an overview of your compliance status across all modules. 
                  Use the sidebar to navigate to specific features.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" size="sm">
                    <span>View Tutorial</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <span>Documentation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <StatusCard 
                  title="Overall Compliance"
                  value="87%" 
                  status="success"
                  description="Last updated today"
                />
                
                <StatusCard 
                  title="Open Issues"
                  value="12" 
                  status="warning"
                  description="3 require attention"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Dashboard Content */}
      <DashboardContent />
    </div>
  );
};

interface StatusCardProps {
  title: string;
  value: string;
  status: 'success' | 'warning' | 'danger';
  description: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, status, description }) => {
  const bgColor = {
    success: 'bg-success-muted',
    warning: 'bg-warning-muted',
    danger: 'bg-destructive/10'
  };
  
  const textColor = {
    success: 'text-success',
    warning: 'text-warning-foreground',
    danger: 'text-destructive'
  };
  
  return (
    <div className={`p-4 rounded-lg ${bgColor[status]} border border-${status === 'success' ? 'success' : status === 'warning' ? 'warning' : 'destructive'}/20`}>
      <h3 className="text-sm font-medium text-foreground-secondary">{title}</h3>
      <p className={`text-2xl font-bold ${textColor[status]}`}>{value}</p>
      <p className="text-xs text-foreground-muted">{description}</p>
    </div>
  );
};

export default Dashboard;
