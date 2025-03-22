
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CheckCircle2, Circle, AlertTriangle, File, Image, Send, X } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'not-applicable' | null;
  evidence?: string;
  notes?: string;
  photos?: string[];
}

interface ChecklistSection {
  name: string;
  items: ChecklistItem[];
}

interface AuditChecklistProps {
  auditId: string;
  standardType: string;
  templateName: string;
  onComplete: (findings: number) => void;
  onCancel: () => void;
}

// Example data for SQF Mock Recall Exercise checklist
const mockSQFRecallChecklist: ChecklistSection[] = [
  {
    name: "Traceability System Effectiveness",
    items: [
      {
        id: "tr-1",
        category: "Traceability System Effectiveness",
        requirement: "Digital or paper record system is in place to track all raw materials from receipt to finished product",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "tr-2",
        category: "Traceability System Effectiveness",
        requirement: "Lot coding system is implemented and verified for all products",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "tr-3",
        category: "Traceability System Effectiveness",
        requirement: "System can trace product to customer level (one step forward)",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      }
    ]
  },
  {
    name: "Communication Protocols",
    items: [
      {
        id: "cp-1",
        category: "Communication Protocols",
        requirement: "Recall team contacts are current and accessible",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "cp-2",
        category: "Communication Protocols",
        requirement: "External communications templates (customers, regulatory, media) are available",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "cp-3",
        category: "Communication Protocols",
        requirement: "Roles and responsibilities for recall team are clearly defined",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      }
    ]
  },
  {
    name: "Product Recovery Procedures",
    items: [
      {
        id: "pr-1",
        category: "Product Recovery Procedures",
        requirement: "Procedures exist for recovery of affected product from distribution",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "pr-2",
        category: "Product Recovery Procedures",
        requirement: "Inventory isolation procedures are defined for affected product in stock",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      }
    ]
  },
  {
    name: "Record Keeping",
    items: [
      {
        id: "rk-1",
        category: "Record Keeping",
        requirement: "Mock recall records are maintained for minimum of 2 years",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "rk-2",
        category: "Record Keeping",
        requirement: "Timelines are documented for each phase of the mock recall exercise",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      }
    ]
  }
];

// Example data for FSSC 22000 Environmental Monitoring checklist
const mockFSSCEnvMonitoringChecklist: ChecklistSection[] = [
  {
    name: "Sampling Plan",
    items: [
      {
        id: "sp-1",
        category: "Sampling Plan",
        requirement: "Documented environmental monitoring program exists with defined zones",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "sp-2",
        category: "Sampling Plan",
        requirement: "Sample sites include food contact surfaces, adjacent areas, and other zones",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "sp-3",
        category: "Sampling Plan",
        requirement: "Sampling frequency is risk-based and documented",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      }
    ]
  },
  {
    name: "Testing Methods",
    items: [
      {
        id: "tm-1",
        category: "Testing Methods",
        requirement: "Testing methods are validated for detection of target organisms",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "tm-2",
        category: "Testing Methods",
        requirement: "Laboratory conducting analysis is accredited or approved",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      }
    ]
  },
  {
    name: "Corrective Actions",
    items: [
      {
        id: "ca-1",
        category: "Corrective Actions",
        requirement: "Documented corrective action procedures exist for positive results",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "ca-2",
        category: "Corrective Actions",
        requirement: "Root cause analysis is performed for positive pathogen findings",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      },
      {
        id: "ca-3",
        category: "Corrective Actions",
        requirement: "Effectiveness of corrective actions is verified",
        status: null,
        evidence: "",
        notes: "",
        photos: []
      }
    ]
  }
];

const AuditChecklist: React.FC<AuditChecklistProps> = ({ 
  auditId,
  standardType,
  templateName,
  onComplete,
  onCancel
}) => {
  // Load the appropriate checklist based on the template name
  const getInitialChecklist = () => {
    if (templateName === "SQF Mock Recall Exercise") {
      return mockSQFRecallChecklist;
    } else if (templateName === "FSSC 22000 Environmental Monitoring") {
      return mockFSSCEnvMonitoringChecklist;
    } else {
      // Default empty checklist
      return [{ name: "General Requirements", items: [] }];
    }
  };

  const [checklist, setChecklist] = useState<ChecklistSection[]>(getInitialChecklist());
  const [activeSection, setActiveSection] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  
  // Calculate progress
  const totalItems = checklist.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = checklist.reduce((acc, section) => {
    return acc + section.items.filter(item => item.status !== null).length;
  }, 0);
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  // Calculate findings
  const findingsCount = checklist.reduce((acc, section) => {
    return acc + section.items.filter(item => item.status === 'non-compliant').length;
  }, 0);

  const updateItemStatus = (sectionIndex: number, itemIndex: number, status: 'compliant' | 'non-compliant' | 'not-applicable') => {
    const newChecklist = [...checklist];
    newChecklist[sectionIndex].items[itemIndex].status = status;
    setChecklist(newChecklist);
  };

  const updateItemNotes = (sectionIndex: number, itemIndex: number, notes: string) => {
    const newChecklist = [...checklist];
    newChecklist[sectionIndex].items[itemIndex].notes = notes;
    setChecklist(newChecklist);
  };

  const handleComplete = () => {
    // In a real application, you would save the audit data here
    console.log('Audit completed:', checklist);
    onComplete(findingsCount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{templateName}</CardTitle>
              <CardDescription>{standardType} - Audit #{auditId}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{progress}% complete</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-fsms-blue" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Show the audit summary with findings when complete */}
      {showSummary ? (
        <Card>
          <CardHeader>
            <CardTitle>Audit Summary</CardTitle>
            <CardDescription>
              {findingsCount > 0 ? `${findingsCount} findings identified` : 'No non-conformances found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checklist.map((section, sectionIndex) => {
                const sectionFindings = section.items.filter(item => item.status === 'non-compliant');
                if (sectionFindings.length === 0) return null;
                
                return (
                  <div key={sectionIndex} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium mb-2">{section.name}</h3>
                    <div className="space-y-3">
                      {sectionFindings.map((item, itemIndex) => (
                        <div key={itemIndex} className="bg-red-50 p-3 rounded-md border border-red-100">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-red-800">{item.requirement}</p>
                              {item.notes && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <p className="font-medium">Notes:</p>
                                  <p>{item.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {findingsCount === 0 && (
                <div className="bg-green-50 p-4 rounded-md border border-green-100 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">
                      All items were found to be compliant
                    </p>
                    <p className="text-sm text-green-600">
                      No corrective actions required
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 border-t pt-4">
            <Button variant="outline" onClick={onCancel}>
              Close
            </Button>
            <Button onClick={handleComplete}>
              Complete Audit
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {/* Section Navigation */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            {checklist.map((section, index) => (
              <Button
                key={index}
                variant={activeSection === index ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => setActiveSection(index)}
              >
                {section.name}
              </Button>
            ))}
          </div>

          {/* Current Section Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>{checklist[activeSection].name}</CardTitle>
              <CardDescription>
                Complete all checklist items in this section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {checklist[activeSection].items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="pt-1">
                        {item.status === 'compliant' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : item.status === 'non-compliant' ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : item.status === 'not-applicable' ? (
                          <X className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.requirement}</p>
                      </div>
                    </div>
                    
                    <div className="ml-8 space-y-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${item.id}-compliant`} 
                            checked={item.status === 'compliant'}
                            onCheckedChange={() => updateItemStatus(activeSection, itemIndex, 'compliant')}
                          />
                          <label
                            htmlFor={`${item.id}-compliant`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Compliant
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${item.id}-non-compliant`} 
                            checked={item.status === 'non-compliant'}
                            onCheckedChange={() => updateItemStatus(activeSection, itemIndex, 'non-compliant')}
                          />
                          <label
                            htmlFor={`${item.id}-non-compliant`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Non-Compliant
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${item.id}-na`} 
                            checked={item.status === 'not-applicable'}
                            onCheckedChange={() => updateItemStatus(activeSection, itemIndex, 'not-applicable')}
                          />
                          <label
                            htmlFor={`${item.id}-na`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Not Applicable
                          </label>
                        </div>
                      </div>
                      
                      {item.status && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`${item.id}-notes`} className="text-sm mb-1 block">
                              Notes or Observations
                            </Label>
                            <Textarea 
                              id={`${item.id}-notes`} 
                              placeholder="Enter details, observations, or corrective actions..."
                              value={item.notes || ''}
                              onChange={(e) => updateItemNotes(activeSection, itemIndex, e.target.value)}
                              className="h-24"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm mb-1 block">
                              Evidence
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Camera className="h-4 w-4" />
                                <span>Add Photo</span>
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <File className="h-4 w-4" />
                                <span>Attach File</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                {activeSection > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveSection(activeSection - 1)}
                  >
                    Previous Section
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {activeSection < checklist.length - 1 ? (
                  <Button onClick={() => setActiveSection(activeSection + 1)}>
                    Next Section
                  </Button>
                ) : (
                  <Button onClick={() => setShowSummary(true)}>
                    Review Findings
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default AuditChecklist;
