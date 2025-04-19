
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CAPAEffectivenessRating, CAPAEffectivenessMetrics } from '@/types/capa';
import { format, differenceInDays } from 'date-fns';

interface CAPAEffectivenessMonitorProps {
  capaId: string;
  title: string;
  implementationDate: string;
  onEffectivenessUpdate: (data: CAPAEffectivenessMetrics) => void;
}

const CAPAEffectivenessMonitor: React.FC<CAPAEffectivenessMonitorProps> = ({
  capaId,
  title,
  implementationDate,
  onEffectivenessUpdate
}) => {
  const [rating, setRating] = useState<CAPAEffectivenessRating>('good');
  const [notes, setNotes] = useState('');
  
  // Calculate days since implementation
  const daysSinceImplementation = differenceInDays(
    new Date(),
    new Date(implementationDate)
  );
  
  const handleSubmit = () => {
    // Calculate score based on rating
    let score = 0;
    switch (rating) {
      case 'excellent':
        score = 100;
        break;
      case 'good':
        score = 85;
        break;
      case 'adequate':
        score = 70;
        break;
      case 'poor':
        score = 40;
        break;
      case 'ineffective':
        score = 0;
        break;
    }
    
    onEffectivenessUpdate({
      score,
      rating,
      notes: notes.trim().length > 0 ? notes : undefined
    });
  };
  
  return (
    <Card>
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Effectiveness Monitoring</span>
          <span className="text-sm font-normal text-gray-500">
            {daysSinceImplementation} days since implementation
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-sm text-gray-600 mb-6">
          Evaluate the effectiveness of the corrective and preventive actions for:
          <span className="font-medium ml-1">{title}</span>
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Effectiveness Rating</h3>
            <RadioGroup 
              value={rating} 
              onValueChange={(value) => setRating(value as CAPAEffectivenessRating)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent" className="font-normal">
                  Excellent - Problem completely eliminated with no recurrence
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good" className="font-normal">
                  Good - Significant improvement with minimal risk of recurrence
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adequate" id="adequate" />
                <Label htmlFor="adequate" className="font-normal">
                  Adequate - Reasonable improvement with some remaining risk
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor" className="font-normal">
                  Poor - Minimal improvement with high risk of recurrence
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ineffective" id="ineffective" />
                <Label htmlFor="ineffective" className="font-normal">
                  Ineffective - No improvement, issue continues to occur
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="notes" className="font-medium">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Provide any additional observations or notes about the effectiveness of the CAPA actions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Submit Effectiveness Assessment</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessMonitor;
