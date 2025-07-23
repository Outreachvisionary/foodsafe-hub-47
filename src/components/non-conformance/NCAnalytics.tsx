import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NonConformance } from '@/types/non-conformance';

interface NCAnalyticsProps {
  nonConformance: NonConformance;
}

const NCAnalytics: React.FC<NCAnalyticsProps> = ({ nonConformance }) => {
  // Calculate metrics based on the non-conformance data
  const getMetrics = () => {
    const reportedDate = new Date(nonConformance.reported_date || '');
    const currentDate = new Date();
    const daysOpen = Math.floor((currentDate.getTime() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const isOverdue = daysOpen > 30; // Assuming 30 days is the target resolution time
    const urgencyScore = calculateUrgencyScore();
    const riskScore = calculateRiskScore();
    const complianceScore = calculateComplianceScore();

    return {
      daysOpen,
      isOverdue,
      urgencyScore,
      riskScore,
      complianceScore,
      targetResolutionDays: 30,
      estimatedResolutionDate: new Date(reportedDate.getTime() + (30 * 24 * 60 * 60 * 1000))
    };
  };

  const calculateUrgencyScore = () => {
    let score = 0;
    
    // Risk level impact
    switch (nonConformance.risk_level?.toLowerCase()) {
      case 'critical': score += 40; break;
      case 'high': score += 30; break;
      case 'medium': score += 20; break;
      case 'low': score += 10; break;
      default: score += 15; break;
    }
    
    // Status impact
    switch (nonConformance.status?.toLowerCase()) {
      case 'on hold': score += 30; break;
      case 'under investigation': score += 20; break;
      case 'under review': score += 15; break;
      default: score += 10; break;
    }
    
    // Quantity impact
    if (nonConformance.quantity_on_hold && nonConformance.quantity_on_hold > 100) {
      score += 20;
    } else if (nonConformance.quantity_on_hold && nonConformance.quantity_on_hold > 50) {
      score += 10;
    }
    
    // Category impact
    if (nonConformance.reason_category?.includes('Safety') || 
        nonConformance.reason_category?.includes('Contamination')) {
      score += 20;
    }
    
    return Math.min(score, 100);
  };

  const calculateRiskScore = () => {
    let score = 0;
    
    // Base risk from risk level
    switch (nonConformance.risk_level?.toLowerCase()) {
      case 'critical': score = 90; break;
      case 'high': score = 70; break;
      case 'medium': score = 50; break;
      case 'low': score = 30; break;
      default: score = 40; break;
    }
    
    // Adjust based on category
    if (nonConformance.reason_category?.includes('Contamination')) score += 10;
    if (nonConformance.reason_category?.includes('Safety')) score += 10;
    if (nonConformance.reason_category?.includes('Regulatory')) score += 5;
    
    return Math.min(score, 100);
  };

  const calculateComplianceScore = () => {
    let score = 100;
    
    // Deduct points for missing information
    if (!nonConformance.assigned_to) score -= 10;
    if (!nonConformance.reason_details) score -= 15;
    if (!nonConformance.department) score -= 5;
    if (!nonConformance.location) score -= 5;
    if (!nonConformance.capa_id) score -= 20;
    
    // Deduct points based on how long it's been open
    const daysOpen = getMetrics().daysOpen;
    if (daysOpen > 60) score -= 30;
    else if (daysOpen > 30) score -= 15;
    else if (daysOpen > 14) score -= 5;
    
    return Math.max(score, 0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const metrics = getMetrics();

  // Simulated historical data for trends
  const getTrendData = () => {
    return {
      similarIssues: Math.floor(Math.random() * 10) + 1,
      resolutionTrend: Math.random() > 0.5 ? 'improving' : 'declining',
      departmentPerformance: Math.floor(Math.random() * 100),
      categoryFrequency: Math.floor(Math.random() * 20) + 1
    };
  };

  const trendData = getTrendData();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Days Open</p>
                  <p className="text-2xl font-bold">
                    {metrics.daysOpen}
                    {metrics.isOverdue && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Overdue
                      </Badge>
                    )}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Urgency Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.urgencyScore)}`}>
                    {metrics.urgencyScore}%
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.riskScore)}`}>
                    {metrics.riskScore}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                  <p className={`text-2xl font-bold ${getScoreColor(metrics.complianceScore)}`}>
                    {metrics.complianceScore}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Resolution Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Target</span>
                <span>{Math.round((metrics.daysOpen / metrics.targetResolutionDays) * 100)}%</span>
              </div>
              <Progress 
                value={Math.min((metrics.daysOpen / metrics.targetResolutionDays) * 100, 100)}
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Target Resolution</p>
                <p className="text-sm font-bold">
                  {metrics.estimatedResolutionDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={metrics.isOverdue ? 'destructive' : 'default'}>
                  {metrics.isOverdue ? 'Overdue' : 'On Track'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Impact Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Quantity Impact</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {nonConformance.quantity_on_hold || 0} units on hold
                  </span>
                  <Badge variant="outline">
                    {nonConformance.units || 'units'}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Department</span>
                <Badge variant="secondary">
                  {nonConformance.department || 'Not Specified'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Location</span>
                <Badge variant="secondary">
                  {nonConformance.location || 'Not Specified'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Category Risk</span>
                <Badge variant={getScoreBadgeVariant(metrics.riskScore)}>
                  {nonConformance.reason_category}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Trend Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{trendData.similarIssues}</p>
                <p className="text-xs text-muted-foreground">Similar Issues (30 days)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{trendData.categoryFrequency}</p>
                <p className="text-xs text-muted-foreground">Category Frequency</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Resolution Trend</span>
                <div className="flex items-center space-x-1">
                  {trendData.resolutionTrend === 'improving' ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-sm capitalize ${
                    trendData.resolutionTrend === 'improving' ? 'text-success' : 'text-destructive'
                  }`}>
                    {trendData.resolutionTrend}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Department Performance</span>
                <span className={`text-sm font-medium ${getScoreColor(trendData.departmentPerformance)}`}>
                  {trendData.departmentPerformance}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.urgencyScore > 70 && (
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">High urgency - prioritize immediate attention</p>
                </div>
              )}
              
              {!nonConformance.capa_id && (
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-warning mt-0.5" />
                  <p className="text-sm">Consider generating a CAPA for systematic resolution</p>
                </div>
              )}
              
              {metrics.isOverdue && (
                <div className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">Overdue - escalate to management for review</p>
                </div>
              )}
              
              {metrics.complianceScore < 70 && (
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-warning mt-0.5" />
                  <p className="text-sm">Improve documentation completeness for better compliance</p>
                </div>
              )}

              {metrics.riskScore > 80 && (
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm">High risk - consider immediate containment actions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NCAnalytics;