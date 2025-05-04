
import React from 'react';

export interface PrebuiltReportsProps {
  layout: string;
}

const PrebuiltReports: React.FC<PrebuiltReportsProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Prebuilt Reports</h3>
      
      <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
        {/* Report items would go here */}
        <p>Showing reports in {layout} layout</p>
      </div>
    </div>
  );
};

export default PrebuiltReports;
