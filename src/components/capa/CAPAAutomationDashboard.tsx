
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { runDailyAutomation, autoEscalateStuckCAPAs } from '@/services/capaAutomationService';
import { getCAPAStats } from '@/services/capaService';
import { toast } from 'sonner';

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
      
      // Update metrics
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

      {/* Metrics Overview */}
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

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
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
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Automation Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overdue Detection</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Auto Assignment</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Review Scheduling</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Escalation Processing</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Deadline Checks</span>
                    <span className="text-sm font-medium">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status Updates</span>
                    <span className="text-sm font-medium">0.8s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Notifications</span>
                    <span className="text-sm font-medium">2.1s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Report Generation</span>
                    <span className="text-sm font-medium">5.3s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Daily Tasks</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Check overdue CAPAs (Every hour)</li>
                      <li>• Process effectiveness reviews (Daily at 9 AM)</li>
                      <li>• Generate performance reports (Daily at 6 PM)</li>
                      <li>• Send deadline warnings (Daily at 8 AM)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Weekly Tasks</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Escalate stuck CAPAs (Mondays at 10 AM)</li>
                      <li>• Comprehensive analytics (Fridays at 5 PM)</li>
                      <li>• System health check (Sundays at midnight)</li>
                      <li>• Archive completed CAPAs (Sundays at 2 AM)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Next Scheduled Tasks</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>Overdue check in 45 minutes</div>
                    <div>Daily reports in 6 hours</div>
                    <div>Weekly escalation in 2 days</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CAPAAutomationDashboard;
