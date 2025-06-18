
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Play, AlertTriangle } from 'lucide-react';
import { runDailyAutomation, autoEscalateStuckCAPAs } from '@/services/capaAutomationService';
import { getCAPAStats } from '@/services/capaService';
import { toast } from 'sonner';
import AutomationMetricsCards from './automation/AutomationMetricsCards';
import AutomationRulesTab from './automation/AutomationRulesTab';
import AutomationPerformanceTab from './automation/AutomationPerformanceTab';
import AutomationScheduleTab from './automation/AutomationScheduleTab';

interface AutomationMetrics {
  totalAutomatedActions: number;
  successRate: number;
  averageProcessingTime: number;
  lastRunTime: string;
  nextScheduledRun: string;
}

const CAPAAutomationDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AutomationMetrics>({
    totalAutomatedActions: 142,
    successRate: 98.5,
    averageProcessingTime: 2.3,
    lastRunTime: new Date().toISOString(),
    nextScheduledRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
  const [isRunning, setIsRunning] = useState(false);
  const [capaStats, setCAPAStats] = useState<any>(null);

  useEffect(() => {
    loadCAPAStats();
  }, []);

  const loadCAPAStats = async () => {
    try {
      const stats = await getCAPAStats();
      setCAPAStats(stats);
    } catch (error) {
      console.error('Error loading CAPA stats:', error);
    }
  };

  const runAutomation = async (type: 'daily' | 'escalation') => {
    setIsRunning(true);
    try {
      if (type === 'daily') {
        await runDailyAutomation();
        toast.success('Daily automation completed successfully');
      } else {
        await autoEscalateStuckCAPAs();
        toast.success('CAPA escalation completed successfully');
      }
      
      setMetrics(prev => ({
        ...prev,
        lastRunTime: new Date().toISOString(),
        totalAutomatedActions: prev.totalAutomatedActions + 1
      }));
      
      await loadCAPAStats();
    } catch (error) {
      toast.error('Automation failed');
    } finally {
      setIsRunning(false);
    }
  };

  const automationRules = [
    {
      id: '1',
      name: 'Overdue CAPA Detection',
      description: 'Automatically marks CAPAs as overdue when past due date',
      enabled: true,
      lastTriggered: '2 hours ago',
      triggerCount: 15
    },
    {
      id: '2',
      name: 'Critical Priority Auto-Assignment',
      description: 'Assigns critical CAPAs to senior quality managers',
      enabled: true,
      lastTriggered: '1 day ago',
      triggerCount: 3
    },
    {
      id: '3',
      name: 'Effectiveness Review Reminder',
      description: 'Schedules effectiveness reviews 30 days after completion',
      enabled: true,
      lastTriggered: '3 hours ago',
      triggerCount: 8
    },
    {
      id: '4',
      name: 'Stuck CAPA Escalation',
      description: 'Escalates CAPAs with no activity for 7+ days',
      enabled: false,
      lastTriggered: 'Never',
      triggerCount: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">CAPA Automation Dashboard</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => runAutomation('daily')}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Run Daily Tasks
          </Button>
          <Button
            variant="outline"
            onClick={() => runAutomation('escalation')}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Run Escalation
          </Button>
        </div>
      </div>

      <AutomationMetricsCards metrics={metrics} />

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <AutomationRulesTab rules={automationRules} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <AutomationPerformanceTab />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <AutomationScheduleTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CAPAAutomationDashboard;
