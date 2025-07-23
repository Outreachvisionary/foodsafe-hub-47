import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface RiskAssessment {
  id?: string;
  hazardIdentification: string;
  riskCategory: string;
  probability: number; // 1-5 scale
  severity: number; // 1-5 scale
  riskScore: number; // probability * severity
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  controlMeasures: string;
  residualRisk: number;
  acceptableRisk: boolean;
  reviewDate: string;
  reviewedBy?: string;
}

interface CAPARiskAssessmentProps {
  capaId: string;
  currentAssessment?: RiskAssessment;
  onSave: (assessment: RiskAssessment) => void;
}

const CAPARiskAssessment: React.FC<CAPARiskAssessmentProps> = ({
  capaId,
  currentAssessment,
  onSave
}) => {
  const [assessment, setAssessment] = useState<RiskAssessment>(
    currentAssessment || {
      hazardIdentification: '',
      riskCategory: '',
      probability: 1,
      severity: 1,
      riskScore: 1,
      riskLevel: 'Low',
      controlMeasures: '',
      residualRisk: 1,
      acceptableRisk: false,
      reviewDate: new Date().toISOString().split('T')[0]
    }
  );

  const [isEditing, setIsEditing] = useState(!currentAssessment);

  const calculateRiskScore = (probability: number, severity: number) => {
    return probability * severity;
  };

  const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (score <= 5) return 'Low';
    if (score <= 10) return 'Medium';
    if (score <= 15) return 'High';
    return 'Critical';
  };

  const handleProbabilityChange = (value: string) => {
    const prob = parseInt(value);
    const score = calculateRiskScore(prob, assessment.severity);
    setAssessment(prev => ({
      ...prev,
      probability: prob,
      riskScore: score,
      riskLevel: getRiskLevel(score)
    }));
  };

  const handleSeverityChange = (value: string) => {
    const sev = parseInt(value);
    const score = calculateRiskScore(assessment.probability, sev);
    setAssessment(prev => ({
      ...prev,
      severity: sev,
      riskScore: score,
      riskLevel: getRiskLevel(score)
    }));
  };

  const handleSave = () => {
    if (!assessment.hazardIdentification || !assessment.riskCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave(assessment);
    setIsEditing(false);
    toast.success('Risk assessment saved successfully');
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle>Risk Assessment</CardTitle>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Assessment
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hazard">Hazard Identification *</Label>
                <Textarea
                  id="hazard"
                  placeholder="Describe the identified hazard..."
                  value={assessment.hazardIdentification}
                  onChange={(e) => setAssessment(prev => ({
                    ...prev,
                    hazardIdentification: e.target.value
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Risk Category *</Label>
                <Select
                  value={assessment.riskCategory}
                  onValueChange={(value) => setAssessment(prev => ({
                    ...prev,
                    riskCategory: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Microbiological">Microbiological</SelectItem>
                    <SelectItem value="Chemical">Chemical</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Allergen">Allergen</SelectItem>
                    <SelectItem value="Quality">Quality</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (1-5)</Label>
                <Select
                  value={assessment.probability.toString()}
                  onValueChange={handleProbabilityChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Unlikely</SelectItem>
                    <SelectItem value="2">2 - Unlikely</SelectItem>
                    <SelectItem value="3">3 - Possible</SelectItem>
                    <SelectItem value="4">4 - Likely</SelectItem>
                    <SelectItem value="5">5 - Very Likely</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity (1-5)</Label>
                <Select
                  value={assessment.severity.toString()}
                  onValueChange={handleSeverityChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Negligible</SelectItem>
                    <SelectItem value="2">2 - Minor</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - Major</SelectItem>
                    <SelectItem value="5">5 - Catastrophic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Risk Score</Label>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="text-lg font-semibold">{assessment.riskScore}</span>
                  <Badge className={getRiskBadgeColor(assessment.riskLevel)}>
                    {assessment.riskLevel}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="controls">Control Measures</Label>
              <Textarea
                id="controls"
                placeholder="Describe existing control measures..."
                value={assessment.controlMeasures}
                onChange={(e) => setAssessment(prev => ({
                  ...prev,
                  controlMeasures: e.target.value
                }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="residual">Residual Risk (1-25)</Label>
                <Input
                  id="residual"
                  type="number"
                  min="1"
                  max="25"
                  value={assessment.residualRisk}
                  onChange={(e) => setAssessment(prev => ({
                    ...prev,
                    residualRisk: parseInt(e.target.value) || 1
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Review Date</Label>
                <Input
                  id="review"
                  type="date"
                  value={assessment.reviewDate}
                  onChange={(e) => setAssessment(prev => ({
                    ...prev,
                    reviewDate: e.target.value
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="acceptable"
                checked={assessment.acceptableRisk}
                onChange={(e) => setAssessment(prev => ({
                  ...prev,
                  acceptableRisk: e.target.checked
                }))}
                className="rounded"
              />
              <Label htmlFor="acceptable">Risk is acceptable after controls</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Assessment</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Hazard Identification</h4>
                <p className="text-sm text-muted-foreground">{assessment.hazardIdentification}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Risk Category</h4>
                <Badge variant="outline">{assessment.riskCategory}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium mb-2">Probability</h4>
                <span className="text-lg">{assessment.probability}/5</span>
              </div>
              <div>
                <h4 className="font-medium mb-2">Severity</h4>
                <span className="text-lg">{assessment.severity}/5</span>
              </div>
              <div>
                <h4 className="font-medium mb-2">Risk Score</h4>
                <span className="text-lg font-semibold">{assessment.riskScore}</span>
              </div>
              <div>
                <h4 className="font-medium mb-2">Risk Level</h4>
                <Badge className={getRiskBadgeColor(assessment.riskLevel)}>
                  {assessment.riskLevel}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Control Measures</h4>
              <p className="text-sm text-muted-foreground">{assessment.controlMeasures}</p>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <h4 className="font-medium mb-1">Residual Risk</h4>
                <span>{assessment.residualRisk}/25</span>
              </div>
              <div className="flex items-center gap-2">
                {assessment.acceptableRisk ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Risk Acceptable</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Risk Not Acceptable</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-1">Next Review Date</h4>
              <span className="text-sm">{new Date(assessment.reviewDate).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPARiskAssessment;