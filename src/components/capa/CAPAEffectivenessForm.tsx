
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CAPAEffectivenessRating } from '@/types/capa';
import { useToast } from '@/hooks/use-toast';

interface CAPAEffectivenessFormProps {
  capaId?: string;
}

const CAPAEffectivenessForm: React.FC<CAPAEffectivenessFormProps> = ({ capaId }) => {
  const [rating, setRating] = useState<CAPAEffectivenessRating>('Effective');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitting effectiveness assessment:', { capaId, rating, comment });
      
      toast({
        title: "Assessment Saved",
        description: "Your effectiveness assessment has been saved successfully.",
      });
      
      // Reset form or close modal
      setComment('');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save effectiveness assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Effectiveness Assessment</CardTitle>
        <CardDescription>
          Evaluate the effectiveness of the corrective and preventive actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Effectiveness Rating</Label>
            <RadioGroup 
              value={rating} 
              onValueChange={(value) => setRating(value as CAPAEffectivenessRating)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Highly_Effective" id="highly_effective" />
                <Label htmlFor="highly_effective">Highly Effective</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Effective" id="effective" />
                <Label htmlFor="effective">Effective</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Partially_Effective" id="partially_effective" />
                <Label htmlFor="partially_effective">Partially Effective</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Not_Effective" id="not_effective" />
                <Label htmlFor="not_effective">Not Effective</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any observations or comments about the effectiveness of the actions"
              className="min-h-[100px]"
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Assessment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CAPAEffectivenessForm;
