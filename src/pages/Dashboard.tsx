
import React, { useEffect } from 'react';
import DashboardContent from '@/components/dashboard/DashboardOverview';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import AssignRoleButton from '@/components/role/AssignRoleButton';
import useProfileRealtime from '@/hooks/useProfileRealtime';
import { LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useUser();
  const { isListening } = useProfileRealtime();
  
  useEffect(() => {
    console.log('Dashboard mounted, user:', user?.email);
    console.log('Profile listener active:', isListening);
  }, [user, isListening]);
  
  return (
    <div className="container mx-auto p-4">
      <DashboardHeader 
        title={
          <div className="flex items-center gap-2 text-3xl">
            <LayoutDashboard className="h-8 w-8 text-accent" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">Dashboard</span>
          </div>
        } 
        subtitle="Overview of your compliance status" 
        className="mb-8"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 bg-gradient-to-br from-white to-accent/5 border border-accent/20 mt-6 shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">Welcome to Compliance Core</CardTitle>
            <CardDescription className="text-lg">
              Your comprehensive solution for food safety management and compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 text-lg">
              The dashboard provides an overview of your compliance status across all modules. 
              Use the sidebar to navigate to specific features.
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
