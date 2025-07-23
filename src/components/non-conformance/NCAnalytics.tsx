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
  // Calculate basic metrics first (without dependencies)
  const reportedDate = new Date(nonConformance.reported_date || '');
  const currentDate = new Date();
  const daysOpen = Math.floor((currentDate.getTime() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysOpen > 30; // Assuming 30 days is the target resolution time

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
      case 'critical': score += 40; break;
      case 'high': score += 30; break;
      case 'medium': score += 20; break;
      case 'low': score += 10; break;
      default: score += 15; break;
    }
    
    // Add risk based on category
    if (nonConformance.reason_category?.includes('Safety') || 
        nonConformance.reason_category?.includes('Contamination')) {
      score += 25;
    }
    
    // Add risk based on quantity affected
    if (nonConformance.quantity_on_hold && nonConformance.quantity_on_hold > 1000) {
      score += 20;
    } else if (nonConformance.quantity_on_hold && nonConformance.quantity_on_hold > 100) {
      score += 10;
    }
    
    // Add risk based on time open
    if (daysOpen > 60) score += 15;
    else if (daysOpen > 30) score += 10;
    else if (daysOpen > 14) score += 5;
    
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
    
    // Deduct points based on how long it's been open (use daysOpen directly)
    if (daysOpen > 60) score -= 30;
    else if (daysOpen > 30) score -= 15;
    else if (daysOpen > 14) score -= 5;
    
    return Math.max(score, 0);
  };

  // Now calculate all metrics (no circular dependencies)
  const urgencyScore = calculateUrgencyScore();
  const riskScore = calculateRiskScore();
  const complianceScore = calculateComplianceScore();

  const getMetrics = () => {
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

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Open</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.daysOpen}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.isOverdue ? (
                  <span className="text-destructive flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Overdue
                  </span>
                ) : (
                  <span className="text-success flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    On Track
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgency Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.urgencyScore}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={metrics.urgencyScore} className="flex-1" />
                <Badge variant={getScoreBadgeVariant(metrics.urgencyScore)}>
                  {metrics.urgencyScore >= 80 ? 'High' : metrics.urgencyScore >= 60 ? 'Medium' : 'Low'}
                </Badge>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.riskScore}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={metrics.riskScore} className="flex-1" />
                <Badge variant={getScoreBadgeVariant(metrics.riskScore)}>
                  {metrics.riskScore >= 80 ? 'Critical' : metrics.riskScore >= 60 ? 'High' : 'Low'}
                </Badge>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.complianceScore}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={metrics.complianceScore} className="flex-1" />
                <Badge variant={getScoreBadgeVariant(metrics.complianceScore)}>
                  {metrics.complianceScore >= 80 ? 'Good' : metrics.complianceScore >= 60 ? 'Fair' : 'Poor'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Resolution Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Target Resolution</span>
                  <span className="font-medium">{metrics.targetResolutionDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Resolution</span>
                  <span className="font-medium">
                    {metrics.estimatedResolutionDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4">
                  <Progress 
                    value={Math.min((metrics.daysOpen / metrics.targetResolutionDays) * 100, 100)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {metrics.daysOpen} of {metrics.targetResolutionDays} days used
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Risk Level</span>
                  <Badge variant={nonConformance.risk_level === 'Critical' ? 'destructive' : 'default'}>
                    {nonConformance.risk_level || 'Not Set'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quantity Affected</span>
                  <span className="font-medium">
                    {nonConformance.quantity_on_hold || 0} {nonConformance.units || 'units'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Department</span>
                  <span className="font-medium">{nonConformance.department || 'Not Set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CAPA Status</span>
                  <Badge variant={nonConformance.capa_id ? 'default' : 'secondary'}>
                    {nonConformance.capa_id ? 'Linked' : 'No CAPA'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.isOverdue && (
                <div className="flex items-center text-destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm">This non-conformance is overdue and requires immediate attention.</span>
                </div>
              )}
              {!nonConformance.capa_id && (
                <div className="flex items-center text-warning">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  <span className="text-sm">Consider creating a CAPA for this non-conformance.</span>
                </div>
              )}
              {!nonConformance.assigned_to && (
                <div className="flex items-center text-warning">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  <span className="text-sm">Assign an owner to expedite resolution.</span>
                </div>
              )}
              {metrics.complianceScore >= 80 && (
                <div className="flex items-center text-success">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Good compliance score. Continue monitoring progress.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NCAnalytics;