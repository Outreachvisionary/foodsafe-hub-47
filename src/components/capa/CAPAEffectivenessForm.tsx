
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CAPAEffectivenessRating } from '@/types/capa'; 

interface CAPAEffectivenessFormProps {
  capaId: string;
}

export const CAPAEffectivenessForm: React.FC<CAPAEffectivenessFormProps> = ({ capaId }) => {
  const [rating, setRating] = useState<CAPAEffectivenessRating>('Effective');
  const [rootCauseEliminated, setRootCauseEliminated] = useState(false);
  const [preventiveMeasuresImplemented, setPreventiveMeasuresImplemented] = useState(false);
  const [recurrence, setRecurrence] = useState('No');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Example of form submission
    console.log({
      capaId,
      rating,
      rootCauseEliminated,
      preventiveMeasuresImplemented,
      recurrence,
      notes
    });
    
    // Here you would typically send this data to your API
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Effectiveness Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2">
              <Label>Has the root cause been eliminated?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rootCauseEliminated" 
                checked={rootCauseEliminated}
                onCheckedChange={(checked) => setRootCauseEliminated(!!checked)}
              />
              <Label htmlFor="rootCauseEliminated">Yes, root cause has been eliminated</Label>
            </div>
          </div>
          
          <div>
            <div className="mb-2">
              <Label>Have preventive measures been implemented?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="preventiveMeasures" 
                checked={preventiveMeasuresImplemented}
                onCheckedChange={(checked) => setPreventiveMeasuresImplemented(!!checked)}
              />
              <Label htmlFor="preventiveMeasures">Yes, preventive measures are in place</Label>
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Has the issue recurred?</Label>
            <RadioGroup value={recurrence} onValueChange={setRecurrence} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="no-recurrence" />
                <Label htmlFor="no-recurrence">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="yes-recurrence" />
                <Label htmlFor="yes-recurrence">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Unknown" id="unknown-recurrence" />
                <Label htmlFor="unknown-recurrence">Unknown</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">Overall effectiveness rating</Label>
            <RadioGroup value={rating} onValueChange={setRating as any} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Highly_Effective" id="highly-effective" />
                <Label htmlFor="highly-effective">Highly Effective</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Effective" id="effective" />
                <Label htmlFor="effective">Effective</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Partially_Effective" id="partially-effective" />
                <Label htmlFor="partially-effective">Partially Effective</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Not_Effective" id="not-effective" />
                <Label htmlFor="not-effective">Not Effective</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="notes" className="mb-2 block">Additional notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional observations or comments..."
              className="min-h-[100px]"
            />
          </div>
          
          <Button type="submit">
            Submit Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessForm;
