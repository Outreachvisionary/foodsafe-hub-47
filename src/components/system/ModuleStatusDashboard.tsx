
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { moduleConnector } from '@/services/moduleConnector';

interface ModuleHealth {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: Date;
  message?: string;
}

const ModuleStatusDashboard: React.FC = () => {
  const [moduleHealth, setModuleHealth] = useState<Map<string, ModuleHealth>>(new Map());
  const [loading, setLoading] = useState(false);

  const refreshModuleStatus = async () => {
    setLoading(true);
    try {
      await moduleConnector.initializeModules();
      setModuleHealth(moduleConnector.getAllModuleHealth());
    } catch (error) {
      console.error('Error refreshing module status:', error);
    } finally {
      setLoading(false);
    }
  };

  const repairModule = async (moduleName: string) => {
    setLoading(true);
    try {
      const success = await moduleConnector.repairModule(moduleName);
      if (success) {
        setModuleHealth(moduleConnector.getAllModuleHealth());
      }
    } catch (error) {
      console.error('Error repairing module:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshModuleStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-foreground">System Module Status</CardTitle>
          </div>
          <Button 
            onClick={refreshModuleStatus} 
            disabled={loading}
            size="sm"
            variant="outline"
            className="btn-hover-effect"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from(moduleHealth.entries()).map(([moduleName, health]) => (
            <div key={moduleName} className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-border transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                  {getStatusIcon(health.status)}
                </div>
                <div>
                  <h4 className="font-semibold capitalize text-foreground">{moduleName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Last checked: {health.lastCheck.toLocaleTimeString()}
                  </p>
                  {health.message && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {health.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={health.status === 'healthy' ? 'default' : health.status === 'warning' ? 'secondary' : 'destructive'}
                  className="capitalize px-3 py-1"
                >
                  {health.status}
                </Badge>
                {health.status !== 'healthy' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => repairModule(moduleName)}
                    disabled={loading}
                    className="btn-hover-effect"
                  >
                    Repair
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {moduleHealth.size === 0 && (
            <div className="text-center py-8">
              <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No modules detected</p>
              <Button 
                onClick={refreshModuleStatus} 
                variant="outline" 
                size="sm" 
                className="mt-3"
              >
                Initialize Modules
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleStatusDashboard;
