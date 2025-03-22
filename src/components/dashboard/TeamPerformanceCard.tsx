
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';

interface Team {
  name: string;
  progress: number;
}

interface TeamPerformanceCardProps {
  teams: Team[];
}

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ teams }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Team Performance</span>
          <Users className="h-5 w-5 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teams.map((team, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{team.name}</span>
                <span className="text-sm text-gray-500">{team.progress}%</span>
              </div>
              <Progress value={team.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceCard;
