
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EffectivenessRating } from '@/types/enums';
import { effectivenessRatingToString } from '@/utils/typeAdapters';

interface CAPAEffectivenessFormProps {
  capaId: string;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

const CAPAEffectivenessForm: React.FC<CAPAEffectivenessFormProps> = ({
  capaId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    rating: EffectivenessRating.Pending,
    rootCauseEliminated: false,
    preventiveMeasuresImplemented: false,
    documentationComplete: false,
    recurrenceCheck: '',
    notes: '',
    score: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const handleRatingChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      rating: value as EffectivenessRating
    }));
  };

  const calculateScore = () => {
    let score = 0;
    if (formData.rootCauseEliminated) score += 25;
    if (formData.preventiveMeasuresImplemented) score += 25;
    if (formData.documentationComplete) score += 25;
    if (formData.rating === EffectivenessRating.Effective) score += 25;
    else if (formData.rating === EffectivenessRating.Partially_Effective) score += 15;
    
    setFormData(prev => ({ ...prev, score }));
  };

  React.useEffect(() => {
    calculateScore();
  }, [formData.rootCauseEliminated, formData.preventiveMeasuresImplemented, formData.documentationComplete, formData.rating]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA Effectiveness Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Overall Effectiveness Rating</Label>
              <Select value={effectivenessRatingToString(formData.rating)} onValueChange={handleRatingChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={effectivenessRatingToString(EffectivenessRating.Effective)}>
                    Effective
                  </SelectItem>
                  <SelectItem value={effectivenessRatingToString(EffectivenessRating.Partially_Effective)}>
                    Partially Effective
                  </SelectItem>
                  <SelectItem value={effectivenessRatingToString(EffectivenessRating.Not_Effective)}>
                    Not Effective
                  </SelectItem>
                  <SelectItem value={effectivenessRatingToString(EffectivenessRating.Pending)}>
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rootCause"
                  checked={formData.rootCauseEliminated}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rootCauseEliminated: checked as boolean }))
                  }
                />
                <Label htmlFor="rootCause">Root cause has been eliminated</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preventive"
                  checked={formData.preventiveMeasuresImplemented}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, preventiveMeasuresImplemented: checked as boolean }))
                  }
                />
                <Label htmlFor="preventive">Preventive measures have been implemented</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentation"
                  checked={formData.documentationComplete}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, documentationComplete: checked as boolean }))
                  }
                />
                <Label htmlFor="documentation">Documentation is complete</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assessment Score: {formData.score}/100</Label>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${formData.score}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrenceCheck">Recurrence Check</Label>
              <Textarea
                id="recurrenceCheck"
                placeholder="Has the same issue occurred elsewhere?"
                value={formData.recurrenceCheck}
                onChange={(e) => setFormData(prev => ({ ...prev, recurrenceCheck: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional observations or recommendations"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Assessment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessForm;
