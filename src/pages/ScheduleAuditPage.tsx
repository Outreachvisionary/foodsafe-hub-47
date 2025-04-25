
import React from "react";
import DashboardHeader from '@/components/DashboardHeader';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ScheduleAuditForm from "@/components/audits/ScheduleAuditForm";

const ScheduleAuditPage: React.FC = () => {
  return (
    <SidebarLayout>
      <DashboardHeader title="Schedule an Audit" subtitle="Create a new audit plan" />
      <div className="container max-w-4xl mx-auto py-6">
        <ScheduleAuditForm />
      </div>
    </SidebarLayout>
  );
};

export default ScheduleAuditPage;
