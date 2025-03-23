
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivitySquare, BookOpen, Award, FileCheck, Clock, UserRound } from 'lucide-react';

const RecentActivitiesCard: React.FC = () => {
  // Sample recent activities data
  const recentActivities = [
    { 
      id: '1', 
      type: 'completed',
      course: 'GMP Refresher', 
      user: 'Maria Garcia',
      time: '2 hours ago',
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      id: '2', 
      type: 'certification',
      course: 'HACCP Certification', 
      user: 'John Smith',
      time: '4 hours ago',
      icon: <Award className="h-4 w-4" />
    },
    { 
      id: '3', 
      type: 'assessment',
      course: 'Food Safety Practical Assessment', 
      user: 'Robert Johnson',
      time: 'Yesterday',
      icon: <FileCheck className="h-4 w-4" />
    },
    { 
      id: '4', 
      type: 'assigned',
      course: 'ISO 9001:2015 Overview', 
      user: 'Susan Miller',
      time: 'Yesterday',
      icon: <Clock className="h-4 w-4" />
    },
    { 
      id: '5', 
      type: 'enrolled',
      course: 'Quality Management Systems', 
      user: 'David Wilson',
      time: '2 days ago',
      icon: <UserRound className="h-4 w-4" />
    }
  ];
  
  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'completed':
        return `completed "${activity.course}"`;
      case 'certification':
        return `received ${activity.course}`;
      case 'assessment':
        return `passed assessment for "${activity.course}"`;
      case 'assigned':
        return `was assigned "${activity.course}"`;
      case 'enrolled':
        return `enrolled in "${activity.course}"`;
      default:
        return `interacted with "${activity.course}"`;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completed':
        return 'text-green-500';
      case 'certification':
        return 'text-amber-500';
      case 'assessment':
        return 'text-blue-500';
      case 'assigned':
        return 'text-purple-500';
      case 'enrolled':
        return 'text-teal-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <ActivitySquare className="h-5 w-5 text-blue-500 mr-2" />
          Recent Activities
        </CardTitle>
        <CardDescription>Latest training activities across the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`${getActivityColor(activity.type)} mt-0.5`}>
                {activity.icon}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  {' '}
                  {getActivityText(activity)}
                </p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          ))}
          
          <button className="text-sm text-blue-500 hover:text-blue-700 transition-colors w-full text-center mt-2">
            View all activities
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
