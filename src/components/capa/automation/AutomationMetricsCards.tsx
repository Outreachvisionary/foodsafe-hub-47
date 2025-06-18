
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

interface AutomationMetrics {
  totalAutomatedActions: number;
  successRate: number;
  averageProcessingTime: number;
  nextScheduledRun: string;
}

interface AutomationMetricsCardsProps {
  metrics: AutomationMetrics;
}

const AutomationMetricsCards: React.FC<AutomationMetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Automated Actions</p>
              <p className="text-2xl font-bold">{metrics.totalAutomatedActions}</p>
            </div>
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{metrics.successRate}%</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Processing Time</p>
              <p className="text-2xl font-bold">{metrics.averageProcessingTime}s</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Next Run</p>
              <p className="text-sm font-medium">
                {new Date(metrics.nextScheduledRun).toLocaleTimeString()}
              </p>
            </div>
            <RefreshCw className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationMetricsCards;
