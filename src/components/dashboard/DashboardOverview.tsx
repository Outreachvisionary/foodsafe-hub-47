
import React from 'react';
import ComplianceOverviewCard from './ComplianceOverviewCard';
import OpenIssuesCard from './OpenIssuesCard';
import UpcomingAuditsCard from './UpcomingAuditsCard';
import ComplianceTrendChart from './ComplianceTrendChart';
import DocumentStatusCard from './DocumentStatusCard';
import RecentActivitiesCard from './RecentActivitiesCard';
import TeamPerformanceCard from './TeamPerformanceCard';
import { ListChecks, AlertCircle, ShieldCheck, CalendarDays } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ComplianceOverviewCard 
          compliancePercentage={87} 
          changePercentage={2.5} 
        />
        
        <OpenIssuesCard 
          totalIssues={12} 
          criticalIssues={2} 
          majorIssues={4} 
          minorIssues={6} 
        />
        
        <UpcomingAuditsCard audits={upcomingAudits} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ComplianceTrendChart />
        
        <DocumentStatusCard documents={documentStatus} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in delay-500">
        <RecentActivitiesCard activities={recentActivities} />
        
        <TeamPerformanceCard teams={teamPerformance} />
      </div>
    </div>
  );
};

export default DashboardOverview;
