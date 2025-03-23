
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, CheckCircle2, AlertCircle, Lightbulb, BarChart3, Repeat, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface RootCauseSuggestion {
  text: string;
  confidence: number;
  explanation?: string;
}

interface RootCauseAnalysisProps {
  findingId: string;
  findingType: string;
  findingDescription: string;
  severity: string;
  onRootCauseSelected?: (rootCause: string) => void;
}

const RootCauseAnalysis: React.FC<RootCauseAnalysisProps> = ({
  findingId,
  findingType,
  findingDescription,
  severity,
  onRootCauseSelected
}) => {
  const [rootCauseText, setRootCauseText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<RootCauseSuggestion[]>([]);
  
  // Mock function to simulate AI analysis
  const analyzeRootCause = () => {
    setIsAnalyzing(true);
    
    // In a real implementation, this would call an API with machine learning models
    setTimeout(() => {
      // Mock suggestions based on the finding type
      let mockSuggestions: RootCauseSuggestion[] = [];
      
      if (findingType.includes('sanitati') || findingDescription.includes('sanitati')) {
        mockSuggestions = [
          { 
            text: 'Inadequate sanitizer concentration due to improper mixing procedures', 
            confidence: 0.89,
            explanation: 'Historical data shows 78% of similar findings were related to sanitizer concentration issues. Recent audit records indicate inconsistent mixing procedures.'
          },
          { 
            text: 'Ineffective cleaning procedure sequence allowing cross-contamination', 
            confidence: 0.76,
            explanation: 'Analysis of 42 similar cases revealed that cleaning equipment in the wrong order led to recontamination of sanitized surfaces.'
          },
          { 
            text: 'Biofilm formation in hard-to-clean areas due to equipment design', 
            confidence: 0.72,
            explanation: 'Equipment design in packaging area creates niches where biofilms can form. Similar equipment in other facilities had similar issues.'
          }
        ];
      } else if (findingType.includes('temperat') || findingDescription.includes('temperat')) {
        mockSuggestions = [
          { 
            text: 'Defective compressor in cooling system requiring replacement', 
            confidence: 0.91,
            explanation: 'System logs indicate compressor cycling issues for 3 weeks prior to the deviation. Maintenance records show similar pattern before previous failures.'
          },
          { 
            text: 'Improper door sealing allowing temperature fluctuation', 
            confidence: 0.82,
            explanation: 'Door seal inspection records show degradation. Thermal imaging indicates heat infiltration around door perimeter.'
          },
          { 
            text: 'Overloading of storage room beyond designed capacity', 
            confidence: 0.65,
            explanation: 'Inventory records show room was at 115% of designed capacity during the incident, reducing air circulation effectiveness.'
          }
        ];
      } else {
        mockSuggestions = [
          { 
            text: 'Inadequate employee training on standard procedures', 
            confidence: 0.82,
            explanation: 'Training records indicate 30% of staff haven\'t completed required refresher training.'
          },
          { 
            text: 'Process design flaw allowing for critical control point failures', 
            confidence: 0.77,
            explanation: 'Process flow analysis indicates a design vulnerability at this control point that appears in 65% of similar incidents.'
          },
          { 
            text: 'Equipment maintenance issue causing inconsistent performance', 
            confidence: 0.71,
            explanation: 'Maintenance logs show increasing frequency of minor adjustments needed, suggesting progressive deterioration.'
          }
        ];
      }
      
      setSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000); // Simulate API delay
  };
  
  const applySuggestion = (suggestion: RootCauseSuggestion) => {
    setRootCauseText(suggestion.text);
    if (onRootCauseSelected) {
      onRootCauseSelected(suggestion.text);
    }
    toast.success("Root cause applied to analysis");
  };
  
  const handleSubmit = () => {
    if (!rootCauseText.trim()) {
      toast.error("Please enter a root cause analysis");
      return;
    }
    
    if (onRootCauseSelected) {
      onRootCauseSelected(rootCauseText);
    }
    
    toast.success("Root cause analysis saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          AI-Assisted Root Cause Analysis
        </CardTitle>
        <CardDescription>
          Analyze underlying causes of {findingId} with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-gray-50 border rounded-md">
          <h4 className="text-sm font-medium">Finding Description</h4>
          <p className="text-sm mt-1">{findingDescription}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-amber-100 text-amber-800">{findingType}</Badge>
            <Badge className="bg-red-100 text-red-800">{severity}</Badge>
          </div>
        </div>
        
        <div>
          <Label htmlFor="rootCause">Root Cause Analysis</Label>
          <Textarea 
            id="rootCause" 
            placeholder="Enter your root cause analysis or use AI suggestions..."
            value={rootCauseText}
            onChange={(e) => setRootCauseText(e.target.value)}
            className="mt-1 min-h-[100px]"
          />
        </div>
        
        {suggestions.length === 0 && !isAnalyzing && (
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={analyzeRootCause}
          >
            <Brain className="h-4 w-4 mr-2" />
            Analyze with AI
          </Button>
        )}
        
        {isAnalyzing && (
          <div className="text-center p-4 space-y-3">
            <Brain className="h-8 w-8 mx-auto text-purple-600 animate-pulse" />
            <p className="text-sm text-gray-600">Analyzing potential root causes...</p>
            <Progress value={45} className="h-2" />
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center">
              <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
              AI-Suggested Root Causes
            </h4>
            
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <p className="text-sm">{suggestion.text}</p>
                  <Badge className="bg-gray-100 text-gray-800">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </Badge>
                </div>
                
                {suggestion.explanation && (
                  <Alert className="mt-2 bg-blue-50 text-blue-800 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription>
                      {suggestion.explanation}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => applySuggestion(suggestion)}
                    className="text-xs"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Apply
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span className="flex items-center">
                <BarChart3 className="h-3 w-3 mr-1" />
                Based on analysis of 248 similar findings
              </span>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={analyzeRootCause}>
                <Repeat className="h-3 w-3 mr-1" />
                Refresh Analysis
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" className="flex items-center">
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          View Related CAPAs
        </Button>
        <Button onClick={handleSubmit}>
          Save Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RootCauseAnalysis;
