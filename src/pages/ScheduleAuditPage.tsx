
import React from "react";
import DashboardHeader from '@/components/DashboardHeader';
import AuditScheduleForm from "@/components/audits/ScheduleAuditForm";

const ScheduleAuditPage: React.FC = () => {
  return (
    <>
      <DashboardHeader title="Schedule Audit" subtitle="Plan and schedule a new audit" />
      <div className="container max-w-4xl mx-auto py-6">
        <AuditScheduleForm />
      </div>
    </>
  );
};

export default ScheduleAuditPage;
