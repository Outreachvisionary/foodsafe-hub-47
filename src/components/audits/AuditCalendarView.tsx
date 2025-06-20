
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { DatabaseAudit } from '@/hooks/useInternalAudits';

interface AuditCalendarViewProps {
  audits: DatabaseAudit[];
}

const AuditCalendarView: React.FC<AuditCalendarViewProps> = ({ audits }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getAuditsForDate = (date: Date) => {
    return audits.filter(audit => 
      isSameDay(new Date(audit.start_date), date) ||
      isSameDay(new Date(audit.due_date), date)
    );
  };

  const getAuditDates = () => {
    const dates = new Set<string>();
    audits.forEach(audit => {
      dates.add(format(new Date(audit.start_date), 'yyyy-MM-dd'));
      dates.add(format(new Date(audit.due_date), 'yyyy-MM-dd'));
    });
    return Array.from(dates).map(date => new Date(date));
  };

  const auditDates = getAuditDates();
  const selectedDateAudits = selectedDate ? getAuditsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Audit Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={{
              hasAudit: auditDates
            }}
            modifiersStyles={{
              hasAudit: {
                backgroundColor: 'rgb(59 130 246 / 0.1)',
                color: 'rgb(59 130 246)',
                fontWeight: 'bold'
              }
            }}
            className="rounded-md border pointer-events-auto"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate && selectedDateAudits.length > 0 ? (
            <div className="space-y-3">
              {selectedDateAudits.map((audit) => (
                <div key={audit.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{audit.title}</h4>
                    <Badge className={getStatusColor(audit.status)}>
                      {audit.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {audit.audit_type} • {audit.assigned_to}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Start: {format(new Date(audit.start_date), 'MMM d')} • 
                    Due: {format(new Date(audit.due_date), 'MMM d')}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <p className="text-muted-foreground text-center py-8">
              No audits scheduled for this date
            </p>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Select a date to view scheduled audits
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditCalendarView;
