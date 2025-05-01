
import React from "react";
import DashboardHeader from '@/components/DashboardHeader';
import NewSupplierForm from "@/components/suppliers/NewSupplierForm";

const NewSupplierPage: React.FC = () => {
  return (
    <>
      <DashboardHeader title="Add New Supplier" subtitle="Register a new supplier in the system" />
      <div className="container max-w-4xl mx-auto py-6">
        <NewSupplierForm />
      </div>
    </>
  );
};

export default NewSupplierPage;
