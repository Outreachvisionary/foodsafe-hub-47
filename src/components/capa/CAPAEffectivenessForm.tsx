
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EffectivenessRating } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';

interface CAPAEffectivenessFormProps {
  capaId: string;
  onSave: (data: {
    rootCauseEliminated: boolean;
    preventiveMeasuresImplemented: boolean;
    documentationComplete: boolean;
    rating: EffectivenessRating;
    notes: string;
    score: number;
  }) => void;
}

const CAPAEffectivenessForm: React.FC<CAPAEffectivenessFormProps> = ({ capaId, onSave }) => {
  const { toast } = useToast();
  const [rootCauseEliminated, setRootCauseEliminated] = useState(false);
  const [preventiveMeasuresImplemented, setPreventiveMeasuresImplemented] = useState(false);
  const [documentationComplete, setDocumentationComplete] = useState(false);
  const [rating, setRating] = useState<EffectivenessRating>(EffectivenessRating.Ineffective);
  const [notes, setNotes] = useState('');

  const calculateScore = () => {
    let score = 0;
    if (rootCauseEliminated) score += 40;
    if (preventiveMeasuresImplemented) score += 40;
    if (documentationComplete) score += 20;
    return score;
  };

  const handleSave = () => {
    const score = calculateScore();
    onSave({
      rootCauseEliminated,
      preventiveMeasuresImplemented,
      documentationComplete,
      rating,
      notes,
      score
    });
    
    toast({
      title: 'Success',
      description: 'CAPA effectiveness assessment saved',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA Effectiveness Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="rootCause" 
              checked={rootCauseEliminated} 
              onCheckedChange={(checked) => setRootCauseEliminated(checked === true)}
            />
            <div className="space-y-1">
              <Label className="font-medium" htmlFor="rootCause">
                Root cause has been eliminated
              </Label>
              <p className="text-sm text-gray-500">40% of effectiveness score</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="preventive" 
              checked={preventiveMeasuresImplemented} 
              onCheckedChange={(checked) => setPreventiveMeasuresImplemented(checked === true)}
            />
            <div className="space-y-1">
              <Label className="font-medium" htmlFor="preventive">
                Preventive measures have been implemented
              </Label>
              <p className="text-sm text-gray-500">40% of effectiveness score</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="documentation" 
              checked={documentationComplete} 
              onCheckedChange={(checked) => setDocumentationComplete(checked === true)}
            />
            <div className="space-y-1">
              <Label className="font-medium" htmlFor="documentation">
                Documentation is complete and accurate
              </Label>
              <p className="text-sm text-gray-500">20% of effectiveness score</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <Label htmlFor="rating">Overall effectiveness rating</Label>
          <Select 
            value={rating} 
            onValueChange={(value: EffectivenessRating) => setRating(value)}
          >
            <SelectTrigger id="rating">
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EffectivenessRating.Ineffective}>Ineffective</SelectItem>
              <SelectItem value={EffectivenessRating.Partially_Effective}>Partially Effective</SelectItem>
              <SelectItem value={EffectivenessRating.Effective}>Effective</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Assessment notes</Label>
          <Textarea 
            id="notes" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any additional notes regarding the CAPA effectiveness"
            rows={4}
          />
        </div>

        <div className="pt-2">
          <div className="bg-gray-100 rounded p-3 mb-4">
            <span className="font-medium">Current Score: </span> 
            <span className="text-lg font-bold">{calculateScore()}%</span>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessForm;
