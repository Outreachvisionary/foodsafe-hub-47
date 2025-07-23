import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Clock,
  FileCheck,
  BarChart3
} from 'lucide-react';
import { StandardCompliance } from '@/types/standards';
import { LoadingState } from '@/components/ui/enhanced-loading';

interface StandardsOverviewCardsProps {
  compliance: StandardCompliance;
  isLoading?: boolean;
}

const StandardsOverviewCards: React.FC<StandardsOverviewCardsProps> = ({ 
  compliance, 
  isLoading = false 
}) => {
  const cards = [
    {
      title: 'Total Standards',
      value: compliance.totalStandards,
      icon: Shield,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Active standards tracked'
    },
    {
      title: 'Certified',
      value: compliance.certified,
      icon: Award,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      description: 'Fully certified standards'
    },
    {
      title: 'Compliant',
      value: compliance.compliant,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Standards in compliance'
    },
    {
      title: 'In Progress', 
      value: compliance.inProgress,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Standards being implemented'
    },
    {
      title: 'Expiring Soon',
      value: compliance.expiringSoon,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Certifications expiring in 30 days'
    },
    {
      title: 'Expired',
      value: compliance.expired,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Expired certifications'
    },
    {
      title: 'Avg Compliance',
      value: `${compliance.averageCompliance}%`,
      icon: BarChart3,
      color: compliance.averageCompliance >= 80 ? 'text-green-600' : 
            compliance.averageCompliance >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: compliance.averageCompliance >= 80 ? 'bg-green-100' : 
               compliance.averageCompliance >= 60 ? 'bg-yellow-100' : 'bg-red-100',
      description: 'Overall compliance score'
    },
    {
      title: 'Success Rate',
      value: compliance.totalStandards > 0 
        ? `${Math.round(((compliance.certified + compliance.compliant) / compliance.totalStandards) * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Certified + compliant ratio'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <LoadingState isLoading={true}>
                <div className="h-16"></div>
              </LoadingState>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
              
              {/* Progress indicator for percentage values */}
              {card.title === 'Avg Compliance' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        compliance.averageCompliance >= 80 ? 'bg-green-500' :
                        compliance.averageCompliance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${compliance.averageCompliance}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Progress indicator for success rate */}
              {card.title === 'Success Rate' && compliance.totalStandards > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((compliance.certified + compliance.compliant) / compliance.totalStandards) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StandardsOverviewCards;