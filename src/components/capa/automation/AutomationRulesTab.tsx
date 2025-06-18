
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Play, Pause } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  lastTriggered: string;
  triggerCount: number;
}

interface AutomationRulesTabProps {
  rules: AutomationRule[];
}

const AutomationRulesTab: React.FC<AutomationRulesTabProps> = ({ rules }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Automation Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{rule.name}</h4>
                  <Badge variant={rule.enabled ? "default" : "secondary"}>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Last triggered: {rule.lastTriggered}</span>
                  <span>Trigger count: {rule.triggerCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button size="sm" variant={rule.enabled ? "outline" : "default"}>
                  {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationRulesTab;
