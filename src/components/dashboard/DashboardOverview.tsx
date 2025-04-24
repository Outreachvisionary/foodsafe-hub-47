
import React from 'react';
import ComplianceOverviewCard from './ComplianceOverviewCard';
import OpenIssuesCard from './OpenIssuesCard';
import UpcomingAuditsCard from './UpcomingAuditsCard';
import ComplianceTrendChart from './ComplianceTrendChart';
import DocumentStatusCard from './DocumentStatusCard';
import RecentActivitiesCard from './RecentActivitiesCard';
import TeamPerformanceCard from './TeamPerformanceCard';
import { ListChecks, AlertCircle, ShieldCheck, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardOverview: React.FC = () => {
  // Sample data for upcoming audits
  const upcomingAudits = [
    { name: 'SQF Internal Audit', date: 'May 15' },
    { name: 'HACCP Verification', date: 'May 22' },
    { name: 'ISO 22000 Surveillance', date: 'Jun 05' },
  ];

  // Sample data for document status
  const documentStatus = [
    { label: 'Current', count: 32, percentage: 80 },
    { label: 'Needs Review', count: 5, percentage: 12 },
    { label: 'Outdated', count: 3, percentage: 8 },
  ];

  // Sample data for team performance
  const teamPerformance = [
    { name: 'Quality Assurance', progress: 92 },
    { name: 'Production', progress: 78 },
    { name: 'Maintenance', progress: 85 },
    { name: 'Receiving & Storage', progress: 64 },
  ];

  // Sample data for recent activities
  const recentActivities = [
    { 
      icon: <ListChecks className="h-4 w-4" />, 
      action: "Updated HACCP Plan", 
      time: "2 hours ago", 
      user: "John D." 
    },
    { 
      icon: <AlertCircle className="h-4 w-4" />, 
      action: "New non-conformance reported", 
      time: "5 hours ago", 
      user: "Maria S." 
    },
    { 
      icon: <ShieldCheck className="h-4 w-4" />, 
      action: "Completed SQF internal audit", 
      time: "Yesterday", 
      user: "Robert K." 
    },
    { 
      icon: <CalendarDays className="h-4 w-4" />, 
      action: "Scheduled BRC audit", 
      time: "2 days ago", 
      user: "Sarah L." 
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top row cards with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ComplianceOverviewCard 
            compliancePercentage={87} 
            changePercentage={2.5} 
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <OpenIssuesCard 
            totalIssues={12} 
            criticalIssues={2} 
            majorIssues={4} 
            minorIssues={6} 
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <UpcomingAuditsCard audits={upcomingAudits} />
        </motion.div>
      </div>
      
      {/* Middle row with charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ComplianceTrendChart />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <DocumentStatusCard documents={documentStatus} />
        </motion.div>
      </div>
      
      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <RecentActivitiesCard activities={recentActivities} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <TeamPerformanceCard teams={teamPerformance} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
