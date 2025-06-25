
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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            System Module Status
          </CardTitle>
          <Button 
            onClick={refreshModuleStatus} 
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from(moduleHealth.entries()).map(([moduleName, health]) => (
            <div key={moduleName} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(health.status)}
                <div>
                  <h4 className="font-medium capitalize">{moduleName}</h4>
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
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(health.status)}>
                  {health.status}
                </Badge>
                {health.status !== 'healthy' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => repairModule(moduleName)}
                    disabled={loading}
                  >
                    Repair
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleStatusDashboard;
