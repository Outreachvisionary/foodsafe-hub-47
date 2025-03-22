
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface Audit {
  name: string;
  date: string;
}

interface UpcomingAuditsCardProps {
  audits: Audit[];
}

const UpcomingAuditsCard: React.FC<UpcomingAuditsCardProps> = ({ audits }) => {
  return (
    <Card className="animate-scale-in delay-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Clock className="h-5 w-5 text-fsms-blue mr-2" />
          Upcoming Audits
        </CardTitle>
        <CardDescription>Next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-fsms-dark mb-2">{audits.length}</div>
        <div className="space-y-1">
          {audits.map((audit, index) => (
            <div key={index} className="text-sm text-gray-500 flex justify-between">
              <span>{audit.name}</span>
              <span>{audit.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAuditsCard;
