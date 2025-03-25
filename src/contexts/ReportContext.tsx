import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { ReportDefinition, ReportSchedule, ReportExecution, ReportMetrics } from '@/types/report';

type ReportContextType = {
  reports: ReportDefinition[];
  schedules: ReportSchedule[];
  executions: ReportExecution[];
  metrics: ReportMetrics;
  isLoading: boolean;
  generateReport: (reportId: string, format: string) => Promise<void>;
  scheduleReport: (reportId: string, schedule: Omit<ReportSchedule, 'id' | 'reportId'>) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
  toggleScheduleStatus: (scheduleId: string, active: boolean) => Promise<void>;
  runScheduleNow: (scheduleId: string) => Promise<void>;
  shareReport: (reportId: string, emails: string[]) => Promise<void>;
};

const defaultContext: ReportContextType = {
  reports: [],
  schedules: [],
  executions: [],
  metrics: {
    totalReports: 0,
    activeSchedules: 0,
    favoriteReports: 0,
    recentExecutions: 0,
    successRate: 0,
    mostUsedTemplates: []
  },
  isLoading: false,
  generateReport: async () => {},
  scheduleReport: async () => {},
  deleteSchedule: async () => {},
  toggleScheduleStatus: async () => {},
  runScheduleNow: async () => {},
  shareReport: async () => {}
};

const ReportContext = createContext<ReportContextType>(defaultContext);

export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<ReportDefinition[]>([]);
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [executions, setExecutions] = useState<ReportExecution[]>([]);
  const [metrics, setMetrics] = useState<ReportMetrics>(defaultContext.metrics);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const loadSampleData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setReports([
          {
            id: 'rep-1',
            title: 'Document Expiry Summary',
            description: 'List of documents expiring in the next 30, 60, and 90 days',
            category: 'documents',
            createdBy: 'user-123',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
            isTemplate: false,
            isFavorite: true,
            columns: ['id', 'title', 'category', 'expiryDate', 'daysUntilExpiry', 'owner'],
            visualization: {
              type: 'table',
              showLegend: true,
              showGrid: true,
              showLabels: true
            },
            format: 'pdf'
          },
          {
            id: 'rep-2',
            title: 'Audit Findings Summary',
            description: 'Summary of audit findings by category, severity, and department',
            category: 'audits',
            createdBy: 'user-123',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            isTemplate: false,
            columns: ['id', 'auditId', 'findingType', 'severity', 'department', 'capaId'],
            visualization: {
              type: 'bar',
              xAxis: 'department',
              yAxis: 'count',
              showLegend: true,
              showGrid: true,
              showLabels: true
            },
            format: 'excel'
          }
        ]);
        
        setSchedules([
          {
            id: 'sched-1',
            reportId: 'rep-1',
            frequency: 'weekly',
            day: 'monday',
            time: '08:00',
            startDate: new Date().toISOString(),
            nextRunAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
            lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
            recipients: ['quality@example.com', 'management@example.com'],
            status: 'active',
            format: 'pdf',
            notifyOnFailure: true
          },
          {
            id: 'sched-2',
            reportId: 'rep-2',
            frequency: 'monthly',
            day: '1',
            time: '09:00',
            startDate: new Date().toISOString(),
            nextRunAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
            lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
            recipients: ['executive@example.com'],
            status: 'active',
            format: 'excel',
            notifyOnFailure: true
          }
        ]);
        
        setExecutions([
          {
            id: 'exe-1',
            reportId: 'rep-1',
            scheduleId: 'sched-1',
            executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
            executedBy: 'system',
            status: 'success',
            fileUrl: '/reports/document-expiry-20230905.pdf',
            duration: 3.2,
            recipients: ['quality@example.com', 'management@example.com']
          },
          {
            id: 'exe-2',
            reportId: 'rep-2',
            scheduleId: 'sched-2',
            executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
            executedBy: 'system',
            status: 'success',
            fileUrl: '/reports/audit-findings-202308.xlsx',
            duration: 5.7,
            recipients: ['executive@example.com']
          },
          {
            id: 'exe-3',
            reportId: 'rep-1',
            executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
            executedBy: 'user-123',
            status: 'success',
            fileUrl: '/reports/document-expiry-20230829.pdf',
            duration: 2.9
          }
        ]);
        
        setMetrics({
          totalReports: 12,
          activeSchedules: 4,
          favoriteReports: 3,
          recentExecutions: 8,
          successRate: 92,
          mostUsedTemplates: [
            { templateId: 'temp-1', title: 'Document Expiry Summary', usageCount: 24 },
            { templateId: 'temp-2', title: 'Training Compliance Report', usageCount: 18 },
            { templateId: 'temp-3', title: 'CAPA Status Summary', usageCount: 15 }
          ]
        });
        
      } catch (error) {
        console.error('Error loading report data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report data. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSampleData();
  }, [toast]);
  
  const generateReport = async (reportId: string, format: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const reportToGenerate = reports.find(r => r.id === reportId);
      if (!reportToGenerate) {
        throw new Error('Report not found');
      }
      
      const newExecution: ReportExecution = {
        id: `exe-${Date.now()}`,
        reportId,
        executedAt: new Date().toISOString(),
        executedBy: 'user-123',
        status: 'success',
        fileUrl: `/reports/${reportToGenerate.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${format}`,
        duration: Math.random() * 5 + 1
      };
      
      setExecutions(prev => [newExecution, ...prev]);
      
      toast({
        title: 'Report Generated',
        description: `${reportToGenerate.title} has been generated successfully in ${format.toUpperCase()} format.`
      });
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const scheduleReport = async (reportId: string, scheduleData: Omit<ReportSchedule, 'id' | 'reportId'>): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportToSchedule = reports.find(r => r.id === reportId);
      if (!reportToSchedule) {
        throw new Error('Report not found');
      }
      
      const newSchedule: ReportSchedule = {
        id: `sched-${Date.now()}`,
        reportId,
        ...scheduleData,
        nextRunAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
      };
      
      setSchedules(prev => [...prev, newSchedule]);
      setMetrics(prev => ({
        ...prev,
        activeSchedules: prev.activeSchedules + 1
      }));
      
      toast({
        title: 'Report Scheduled',
        description: `${reportToSchedule.title} has been scheduled successfully.`
      });
      
      addNotification({
        id: `notif-${Date.now()}`,
        type: 'info',
        title: 'Report Scheduled',
        message: `A new report schedule has been created for ${reportToSchedule.title}.`,
        read: false,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Error scheduling report:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule report. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSchedule = async (scheduleId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const scheduleToDelete = schedules.find(s => s.id === scheduleId);
      if (!scheduleToDelete) {
        throw new Error('Schedule not found');
      }
      
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      
      if (scheduleToDelete.status === 'active') {
        setMetrics(prev => ({
          ...prev,
          activeSchedules: prev.activeSchedules - 1
        }));
      }
      
      toast({
        title: 'Schedule Deleted',
        description: 'The report schedule has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete schedule. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleScheduleStatus = async (scheduleId: string, active: boolean): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSchedules(prev => prev.map(s => {
        if (s.id === scheduleId) {
          return { ...s, status: active ? 'active' : 'inactive' };
        }
        return s;
      }));
      
      setMetrics(prev => ({
        ...prev,
        activeSchedules: active 
          ? prev.activeSchedules + 1 
          : prev.activeSchedules - 1
      }));
      
      toast({
        title: active ? 'Schedule Enabled' : 'Schedule Disabled',
        description: `The report schedule has been ${active ? 'enabled' : 'disabled'} successfully.`
      });
    } catch (error) {
      console.error('Error toggling schedule status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule status. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const runScheduleNow = async (scheduleId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const scheduleToRun = schedules.find(s => s.id === scheduleId);
      if (!scheduleToRun) {
        throw new Error('Schedule not found');
      }
      
      const reportToGenerate = reports.find(r => r.id === scheduleToRun.reportId);
      if (!reportToGenerate) {
        throw new Error('Report not found');
      }
      
      const newExecution: ReportExecution = {
        id: `exe-${Date.now()}`,
        reportId: scheduleToRun.reportId,
        scheduleId,
        executedAt: new Date().toISOString(),
        executedBy: 'user-123',
        status: 'success',
        fileUrl: `/reports/${reportToGenerate.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${scheduleToRun.format}`,
        duration: Math.random() * 5 + 1,
        recipients: scheduleToRun.recipients
      };
      
      setExecutions(prev => [newExecution, ...prev]);
      
      setSchedules(prev => prev.map(s => {
        if (s.id === scheduleId) {
          return { 
            ...s, 
            lastRunAt: new Date().toISOString(),
            nextRunAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
          };
        }
        return s;
      }));
      
      toast({
        title: 'Report Generated',
        description: `${reportToGenerate.title} has been generated successfully.`
      });
      
      if (scheduleToRun.recipients && scheduleToRun.recipients.length > 0) {
        addNotification({
          id: `notif-${Date.now()}`,
          type: 'info',
          title: 'Report Generated',
          message: `${reportToGenerate.title} has been generated and sent to recipients.`,
          read: false,
          timestamp: new Date()
        });
      }
      
    } catch (error) {
      console.error('Error running schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate report. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const shareReport = async (reportId: string, emails: string[]): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportToShare = reports.find(r => r.id === reportId);
      if (!reportToShare) {
        throw new Error('Report not found');
      }
      
      toast({
        title: 'Report Shared',
        description: `${reportToShare.title} has been shared with ${emails.length} recipient(s).`
      });
      
      addNotification({
        id: `notif-${Date.now()}`,
        type: 'info',
        title: 'Report Shared',
        message: `You shared "${reportToShare.title}" with ${emails.length} recipient(s).`,
        read: false,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sharing report:', error);
      toast({
        title: 'Error',
        description: 'Failed to share report. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ReportContext.Provider value={{
      reports,
      schedules,
      executions,
      metrics,
      isLoading,
      generateReport,
      scheduleReport,
      deleteSchedule,
      toggleScheduleStatus,
      runScheduleNow,
      shareReport
    }}>
      {children}
    </ReportContext.Provider>
  );
};
