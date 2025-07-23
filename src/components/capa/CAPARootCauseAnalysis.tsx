import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FiveWhyAnalysis {
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  rootCause: string;
}

interface FishboneCategory {
  name: string;
  factors: string[];
}

interface RootCauseAnalysis {
  id?: string;
  method: 'five-whys' | 'fishbone' | 'fault-tree' | 'failure-mode';
  problemStatement: string;
  fiveWhys?: FiveWhyAnalysis;
  fishboneCategories?: FishboneCategory[];
  identifiedCauses: string[];
  primaryRootCause: string;
  contributingFactors: string[];
  evidenceSupporting: string;
  validationMethod: string;
  validatedBy?: string;
  validationDate?: string;
}

interface CAPARootCauseAnalysisProps {
  capaId: string;
  currentAnalysis?: RootCauseAnalysis;
  onSave: (analysis: RootCauseAnalysis) => void;
}

const CAPARootCauseAnalysis: React.FC<CAPARootCauseAnalysisProps> = ({
  capaId,
  currentAnalysis,
  onSave
}) => {
  const [analysis, setAnalysis] = useState<RootCauseAnalysis>(
    currentAnalysis || {
      method: 'five-whys',
      problemStatement: '',
      fiveWhys: {
        why1: '',
        why2: '',
        why3: '',
        why4: '',
        why5: '',
        rootCause: ''
      },
      fishboneCategories: [
        { name: 'People', factors: [] },
        { name: 'Process', factors: [] },
        { name: 'Environment', factors: [] },
        { name: 'Materials', factors: [] },
        { name: 'Equipment', factors: [] },
        { name: 'Methods', factors: [] }
      ],
      identifiedCauses: [],
      primaryRootCause: '',
      contributingFactors: [],
      evidenceSupporting: '',
      validationMethod: ''
    }
  );

  const [isEditing, setIsEditing] = useState(!currentAnalysis);
  const [newFactor, setNewFactor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('People');

  const handleFiveWhyChange = (field: keyof FiveWhyAnalysis, value: string) => {
    setAnalysis(prev => ({
      ...prev,
      fiveWhys: {
        ...prev.fiveWhys!,
        [field]: value
      }
    }));
  };

  const addFishboneFactor = () => {
    if (!newFactor.trim()) return;

    setAnalysis(prev => ({
      ...prev,
      fishboneCategories: prev.fishboneCategories!.map(cat =>
        cat.name === selectedCategory
          ? { ...cat, factors: [...cat.factors, newFactor.trim()] }
          : cat
      )
    }));
    setNewFactor('');
  };

  const removeFishboneFactor = (categoryName: string, factorIndex: number) => {
    setAnalysis(prev => ({
      ...prev,
      fishboneCategories: prev.fishboneCategories!.map(cat =>
        cat.name === categoryName
          ? { ...cat, factors: cat.factors.filter((_, index) => index !== factorIndex) }
          : cat
      )
    }));
  };

  const addIdentifiedCause = () => {
    const newCause = prompt('Enter identified cause:');
    if (newCause?.trim()) {
      setAnalysis(prev => ({
        ...prev,
        identifiedCauses: [...prev.identifiedCauses, newCause.trim()]
      }));
    }
  };

  const removeIdentifiedCause = (index: number) => {
    setAnalysis(prev => ({
      ...prev,
      identifiedCauses: prev.identifiedCauses.filter((_, i) => i !== index)
    }));
  };

  const addContributingFactor = () => {
    const newFactor = prompt('Enter contributing factor:');
    if (newFactor?.trim()) {
      setAnalysis(prev => ({
        ...prev,
        contributingFactors: [...prev.contributingFactors, newFactor.trim()]
      }));
    }
  };

  const removeContributingFactor = (index: number) => {
    setAnalysis(prev => ({
      ...prev,
      contributingFactors: prev.contributingFactors.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!analysis.problemStatement || !analysis.primaryRootCause) {
      toast.error('Please fill in the problem statement and primary root cause');
      return;
    }

    onSave(analysis);
    setIsEditing(false);
    toast.success('Root cause analysis saved successfully');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <CardTitle>Root Cause Analysis</CardTitle>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Analysis
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem Statement *</Label>
              <Textarea
                id="problem"
                placeholder="Clearly describe the problem being analyzed..."
                value={analysis.problemStatement}
                onChange={(e) => setAnalysis(prev => ({
                  ...prev,
                  problemStatement: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Analysis Method</Label>
              <Select
                value={analysis.method}
                onValueChange={(value: any) => setAnalysis(prev => ({
                  ...prev,
                  method: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="five-whys">5 Whys Analysis</SelectItem>
                  <SelectItem value="fishbone">Fishbone (Ishikawa) Diagram</SelectItem>
                  <SelectItem value="fault-tree">Fault Tree Analysis</SelectItem>
                  <SelectItem value="failure-mode">Failure Mode Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="method" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="method">Method Details</TabsTrigger>
                <TabsTrigger value="causes">Identified Causes</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
              </TabsList>

              <TabsContent value="method" className="space-y-4">
                {analysis.method === 'five-whys' && analysis.fiveWhys && (
                  <div className="space-y-4">
                    <h4 className="font-medium">5 Whys Analysis</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Why 1?</Label>
                        <Input
                          placeholder="Why did this problem occur?"
                          value={analysis.fiveWhys.why1}
                          onChange={(e) => handleFiveWhyChange('why1', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Why 2?</Label>
                        <Input
                          placeholder="Why did that happen?"
                          value={analysis.fiveWhys.why2}
                          onChange={(e) => handleFiveWhyChange('why2', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Why 3?</Label>
                        <Input
                          placeholder="Why did that happen?"
                          value={analysis.fiveWhys.why3}
                          onChange={(e) => handleFiveWhyChange('why3', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Why 4?</Label>
                        <Input
                          placeholder="Why did that happen?"
                          value={analysis.fiveWhys.why4}
                          onChange={(e) => handleFiveWhyChange('why4', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Why 5?</Label>
                        <Input
                          placeholder="Why did that happen?"
                          value={analysis.fiveWhys.why5}
                          onChange={(e) => handleFiveWhyChange('why5', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Root Cause</Label>
                        <Textarea
                          placeholder="Based on the 5 whys, what is the root cause?"
                          value={analysis.fiveWhys.rootCause}
                          onChange={(e) => handleFiveWhyChange('rootCause', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {analysis.method === 'fishbone' && analysis.fishboneCategories && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Fishbone Diagram</h4>
                    <div className="flex gap-2">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {analysis.fishboneCategories.map(cat => (
                            <SelectItem key={cat.name} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Add factor..."
                        value={newFactor}
                        onChange={(e) => setNewFactor(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addFishboneFactor()}
                      />
                      <Button onClick={addFishboneFactor} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analysis.fishboneCategories.map(category => (
                        <Card key={category.name}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{category.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {category.factors.map((factor, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm">{factor}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFishboneFactor(category.name, index)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="causes" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Identified Causes</h4>
                    <Button onClick={addIdentifiedCause} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cause
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {analysis.identifiedCauses.map((cause, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex-1 justify-start">{cause}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIdentifiedCause(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary">Primary Root Cause *</Label>
                    <Textarea
                      id="primary"
                      placeholder="Identify the primary root cause..."
                      value={analysis.primaryRootCause}
                      onChange={(e) => setAnalysis(prev => ({
                        ...prev,
                        primaryRootCause: e.target.value
                      }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Contributing Factors</h4>
                      <Button onClick={addContributingFactor} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Factor
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {analysis.contributingFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex-1 justify-start">{factor}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContributingFactor(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="validation" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="evidence">Evidence Supporting Root Cause</Label>
                    <Textarea
                      id="evidence"
                      placeholder="Describe evidence that supports the identified root cause..."
                      value={analysis.evidenceSupporting}
                      onChange={(e) => setAnalysis(prev => ({
                        ...prev,
                        evidenceSupporting: e.target.value
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validation">Validation Method</Label>
                    <Select
                      value={analysis.validationMethod}
                      onValueChange={(value) => setAnalysis(prev => ({
                        ...prev,
                        validationMethod: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select validation method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="data-analysis">Data Analysis</SelectItem>
                        <SelectItem value="testing">Testing/Experimentation</SelectItem>
                        <SelectItem value="observation">Direct Observation</SelectItem>
                        <SelectItem value="expert-review">Expert Review</SelectItem>
                        <SelectItem value="simulation">Simulation</SelectItem>
                        <SelectItem value="historical-data">Historical Data Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="validated-by">Validated By</Label>
                      <Input
                        id="validated-by"
                        placeholder="Name of validator"
                        value={analysis.validatedBy || ''}
                        onChange={(e) => setAnalysis(prev => ({
                          ...prev,
                          validatedBy: e.target.value
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="validation-date">Validation Date</Label>
                      <Input
                        id="validation-date"
                        type="date"
                        value={analysis.validationDate || ''}
                        onChange={(e) => setAnalysis(prev => ({
                          ...prev,
                          validationDate: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Analysis</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Problem Statement</h4>
              <p className="text-sm text-muted-foreground">{analysis.problemStatement}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Analysis Method</h4>
              <Badge variant="outline">{analysis.method.replace('-', ' ').toUpperCase()}</Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2">Primary Root Cause</h4>
              <p className="text-sm text-muted-foreground">{analysis.primaryRootCause}</p>
            </div>

            {analysis.contributingFactors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Contributing Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.contributingFactors.map((factor, index) => (
                    <Badge key={index} variant="secondary">{factor}</Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.evidenceSupporting && (
              <div>
                <h4 className="font-medium mb-2">Supporting Evidence</h4>
                <p className="text-sm text-muted-foreground">{analysis.evidenceSupporting}</p>
              </div>
            )}

            {analysis.validationMethod && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Validation Method</h4>
                  <Badge variant="outline">{analysis.validationMethod.replace('-', ' ')}</Badge>
                </div>
                {analysis.validatedBy && (
                  <div>
                    <h4 className="font-medium mb-1">Validated By</h4>
                    <span className="text-sm">{analysis.validatedBy}</span>
                  </div>
                )}
                {analysis.validationDate && (
                  <div>
                    <h4 className="font-medium mb-1">Validation Date</h4>
                    <span className="text-sm">{new Date(analysis.validationDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CAPARootCauseAnalysis;