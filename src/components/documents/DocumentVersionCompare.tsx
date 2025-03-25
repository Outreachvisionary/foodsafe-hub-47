
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DocumentVersion } from '@/types/document';
import { History, Clock, User, FileText, ArrowLeft, ArrowRight } from 'lucide-react';

interface DocumentVersionCompareProps {
  oldVersion: DocumentVersion;
  newVersion: DocumentVersion;
}

const DocumentVersionCompare: React.FC<DocumentVersionCompareProps> = ({
  oldVersion,
  newVersion
}) => {
  // Sample content for visualization - in a real app, you'd fetch this from the API
  const oldContent = `# Standard Operating Procedure
## 1. Purpose
This document outlines the standard operating procedures for raw material receiving.

## 2. Scope
This procedure applies to all incoming raw materials at the facility.

## 3. Responsibilities
- Receiving Personnel: Primary responsibility for implementation
- QA Manager: Oversight and verification

## 4. Procedure
1. Check delivery vehicle condition
2. Verify shipping documents
3. Inspect product packaging
4. Check temperature (if applicable)
5. Complete receiving log`;

  const newContent = `# Standard Operating Procedure
## 1. Purpose
This document outlines the standard operating procedures for raw material receiving.

## 2. Scope
This procedure applies to all incoming raw materials at all company facilities.

## 3. Responsibilities
- Receiving Personnel: Primary responsibility for implementation
- QA Manager: Oversight and verification
- Operations Manager: Resource allocation

## 4. Procedure
1. Check delivery vehicle condition and cleanliness
2. Verify shipping documents match purchase order
3. Inspect product packaging for damage
4. Check temperature (if applicable) using calibrated thermometer
5. Complete electronic receiving log
6. Apply lot tracking label`;

  // Find differences
  const lines1 = oldContent.split('\n');
  const lines2 = newContent.split('\n');
  
  const diffLines = [];
  const maxLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLines; i++) {
    const left = lines1[i] || '';
    const right = lines2[i] || '';
    
    if (left === right) {
      diffLines.push({
        line: i + 1,
        left,
        right,
        status: 'unchanged'
      });
    } else {
      diffLines.push({
        line: i + 1,
        left,
        right,
        status: left && right ? 'modified' : left ? 'removed' : 'added'
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <History className="mr-2 h-5 w-5" />
            Version Comparison
          </h2>
          <p className="text-muted-foreground">
            Compare changes between document versions
          </p>
        </div>
        <Button variant="outline" size="sm">Download Diff Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Version {oldVersion.version}
            </CardTitle>
            <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(oldVersion.created_at || '').toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>By: {oldVersion.created_by}</span>
              </div>
              {oldVersion.change_notes && (
                <div className="mt-1">
                  <Badge variant="outline" className="font-normal">
                    {oldVersion.change_notes}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Version {newVersion.version} (Current)
            </CardTitle>
            <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(newVersion.created_at || '').toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>By: {newVersion.created_by}</span>
              </div>
              {newVersion.change_notes && (
                <div className="mt-1">
                  <Badge variant="outline" className="font-normal">
                    {newVersion.change_notes}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Changes Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Line</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead>Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diffLines.filter(diff => diff.status !== 'unchanged').map((diff, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-xs">{diff.line}</TableCell>
                  <TableCell>
                    {diff.status === 'added' ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        Added
                      </Badge>
                    ) : diff.status === 'removed' ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        Removed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Modified</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {diff.status === 'modified' && (
                        <>
                          <div className="text-sm font-mono line-through text-red-500">{diff.left}</div>
                          <div className="text-sm font-mono text-green-600">{diff.right}</div>
                        </>
                      )}
                      {diff.status === 'added' && (
                        <div className="text-sm font-mono text-green-600">{diff.right}</div>
                      )}
                      {diff.status === 'removed' && (
                        <div className="text-sm font-mono line-through text-red-500">{diff.left}</div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-4">Document Content Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded overflow-auto bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap h-[400px]">
            {lines1.map((line, i) => {
              const diff = diffLines[i];
              return (
                <div 
                  key={i} 
                  className={
                    diff.status === 'unchanged' ? 'text-gray-800' : 
                    diff.status === 'removed' ? 'bg-red-100 text-red-800' : 
                    diff.status === 'modified' ? 'bg-amber-100 text-amber-800' : 
                    ''
                  }
                >
                  {line}
                </div>
              );
            })}
          </div>
          <div className="border rounded overflow-auto bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap h-[400px]">
            {lines2.map((line, i) => {
              const diff = diffLines[i];
              return (
                <div 
                  key={i} 
                  className={
                    diff.status === 'unchanged' ? 'text-gray-800' : 
                    diff.status === 'added' ? 'bg-green-100 text-green-800' : 
                    diff.status === 'modified' ? 'bg-amber-100 text-amber-800' : 
                    ''
                  }
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVersionCompare;
