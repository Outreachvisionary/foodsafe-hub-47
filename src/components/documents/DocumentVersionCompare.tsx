
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ArrowRight, Plus, Minus, RefreshCw } from 'lucide-react';
import { DocumentVersion } from '@/types/document';
import { Separator } from '@/components/ui/separator';

interface DocumentVersionCompareProps {
  oldVersion: DocumentVersion;
  newVersion: DocumentVersion;
}

const DocumentVersionCompare: React.FC<DocumentVersionCompareProps> = ({ 
  oldVersion, 
  newVersion 
}) => {
  const [compareView, setCompareView] = useState<'inline' | 'side-by-side'>('inline');

  // Mock document content for demo purposes
  const oldContent = `
## 1. Purpose
This Standard Operating Procedure (SOP) establishes guidelines for receiving raw materials to ensure compliance with food safety standards.

## 2. Scope
This procedure applies to all incoming raw materials at all facilities.

## 3. Responsibilities
- **Receiving Personnel**: Inspect and document incoming materials
- **QA Manager**: Verify compliance with specifications
- **Operations Manager**: Ensure proper storage

## 4. Procedure
### 4.1 Pre-Receiving Activities
1. Review purchase orders
2. Prepare receiving area
3. Check temperature monitoring equipment

### 4.2 Receiving Inspection
1. Inspect delivery vehicle for cleanliness
2. Check temperature of refrigerated/frozen items
3. Verify packaging integrity
4. Check for pest activity
  `;

  const newContent = `
## 1. Purpose
This Standard Operating Procedure (SOP) establishes guidelines for receiving raw materials to ensure compliance with food safety standards.

## 2. Scope
This procedure applies to all incoming raw materials at all facilities.

## 3. Responsibilities
- **Receiving Personnel**: Inspect and document incoming materials
- **QA Manager**: Verify compliance with specifications
- **Operations Manager**: Ensure proper storage
- **Food Safety Manager**: Verify critical control points

## 4. Procedure
### 4.1 Pre-Receiving Activities
1. Review purchase orders
2. Prepare receiving area
3. Verify calibration of measuring equipment

### 4.2 Receiving Inspection
1. Inspect delivery vehicle for cleanliness
2. Check temperature of refrigerated/frozen items
3. Verify packaging integrity
4. Check for pest activity
5. Verify supplier documentation
  `;

  // Mock function to generate line-by-line diff
  const generateDiff = () => {
    // This would be replaced with a real diff algorithm in production
    return [
      { type: 'unchanged', content: '## 1. Purpose' },
      { type: 'unchanged', content: 'This Standard Operating Procedure (SOP) establishes guidelines for receiving raw materials to ensure compliance with food safety standards.' },
      { type: 'unchanged', content: '' },
      { type: 'unchanged', content: '## 2. Scope' },
      { type: 'unchanged', content: 'This procedure applies to all incoming raw materials at all facilities.' },
      { type: 'unchanged', content: '' },
      { type: 'unchanged', content: '## 3. Responsibilities' },
      { type: 'unchanged', content: '- **Receiving Personnel**: Inspect and document incoming materials' },
      { type: 'unchanged', content: '- **QA Manager**: Verify compliance with specifications' },
      { type: 'unchanged', content: '- **Operations Manager**: Ensure proper storage' },
      { type: 'added', content: '- **Food Safety Manager**: Verify critical control points' },
      { type: 'unchanged', content: '' },
      { type: 'unchanged', content: '## 4. Procedure' },
      { type: 'unchanged', content: '### 4.1 Pre-Receiving Activities' },
      { type: 'unchanged', content: '1. Review purchase orders' },
      { type: 'unchanged', content: '2. Prepare receiving area' },
      { type: 'removed', content: '3. Check temperature monitoring equipment' },
      { type: 'added', content: '3. Verify calibration of measuring equipment' },
      { type: 'unchanged', content: '' },
      { type: 'unchanged', content: '### 4.2 Receiving Inspection' },
      { type: 'unchanged', content: '1. Inspect delivery vehicle for cleanliness' },
      { type: 'unchanged', content: '2. Check temperature of refrigerated/frozen items' },
      { type: 'unchanged', content: '3. Verify packaging integrity' },
      { type: 'unchanged', content: '4. Check for pest activity' },
      { type: 'added', content: '5. Verify supplier documentation' },
    ];
  };

  const diffItems = generateDiff();

  // Timeline data for approval history
  const approvalTimeline = [
    {
      version: 1,
      date: '2023-04-15',
      approver: 'John Doe',
      status: 'Approved',
      notes: 'Initial version'
    },
    {
      version: 2,
      date: '2023-09-20',
      approver: 'Jane Smith',
      status: 'Approved',
      notes: 'Updated with regulatory changes'
    },
    {
      version: newVersion.version,
      date: new Date(newVersion.createdAt).toLocaleDateString(),
      approver: newVersion.createdBy,
      status: 'Pending Approval',
      notes: newVersion.changeNotes || 'No change notes provided'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Version Comparison</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant={compareView === 'inline' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCompareView('inline')}
              className="text-xs"
            >
              Inline View
            </Button>
            <Button 
              variant={compareView === 'side-by-side' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCompareView('side-by-side')}
              className="text-xs"
            >
              Side by Side
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="changes">
          <TabsList className="mb-4">
            <TabsTrigger value="changes" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Changes</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Approval History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="changes">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <Badge variant="outline">Version {oldVersion.version}</Badge>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(oldVersion.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <ArrowRight className="h-6 w-6 text-gray-400" />
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
                <Badge>Version {newVersion.version}</Badge>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(newVersion.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {compareView === 'inline' ? (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-2 border-b text-sm font-medium">
                  Changes between versions
                </div>
                <div className="p-2 font-mono text-sm whitespace-pre-line">
                  {diffItems.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-1 ${
                        item.type === 'added' 
                          ? 'bg-green-50 border-l-2 border-green-400 text-green-800' 
                          : item.type === 'removed' 
                            ? 'bg-red-50 border-l-2 border-red-400 text-red-800 line-through'
                            : ''
                      }`}
                    >
                      {item.type === 'added' && (
                        <Plus className="h-4 w-4 inline-block mr-2 text-green-600" />
                      )}
                      {item.type === 'removed' && (
                        <Minus className="h-4 w-4 inline-block mr-2 text-red-600" />
                      )}
                      {item.content}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-2 border-b text-sm font-medium flex justify-between">
                    <span>Version {oldVersion.version}</span>
                    <Badge variant="outline" className="text-xs">Old</Badge>
                  </div>
                  <pre className="p-4 text-sm whitespace-pre-line overflow-auto max-h-[400px]">
                    {oldContent}
                  </pre>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-2 border-b text-sm font-medium flex justify-between">
                    <span>Version {newVersion.version}</span>
                    <Badge className="text-xs">New</Badge>
                  </div>
                  <pre className="p-4 text-sm whitespace-pre-line overflow-auto max-h-[400px]">
                    {newContent}
                  </pre>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Change notes: {newVersion.changeNotes || 'No change notes provided'}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-2 border-b text-sm font-medium">
                Approval Timeline
              </div>
              <div className="p-4 space-y-4">
                {approvalTimeline.map((item, index) => (
                  <div key={index} className="relative pl-6 pb-4">
                    {index !== approvalTimeline.length - 1 && (
                      <div className="absolute top-2 left-2 bg-gray-300 w-px h-full"></div>
                    )}
                    <div className={`absolute top-1 left-0 rounded-full w-4 h-4 flex items-center justify-center ${
                      item.status === 'Approved' ? 'bg-green-100 border border-green-500' : 'bg-yellow-100 border border-yellow-500'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium">Version {item.version}</span>
                        <Badge className="ml-2" variant={item.status === 'Approved' ? 'default' : 'outline'}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.date} - {item.approver}
                      </div>
                      <p className="text-sm mt-1">{item.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionCompare;
