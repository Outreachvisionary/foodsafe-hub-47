
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, FileText } from 'lucide-react';
import { certificationService } from '@/services/certificationService';
import { useToast } from '@/hooks/use-toast';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await certificationService.exportCertifications();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certifications-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Certifications data has been exported successfully'
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export certifications data',
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const result = await certificationService.importCertifications(file);
      
      toast({
        title: 'Import Completed',
        description: `Successfully imported ${result.success} certifications. ${result.errors.length} errors.`
      });

      if (result.errors.length > 0) {
        console.error('Import errors:', result.errors);
      }
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to import certifications data',
        variant: 'destructive'
      });
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import/Export Certifications</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="export" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 mx-auto text-blue-500" />
              <div>
                <h3 className="font-semibold">Export Certifications</h3>
                <p className="text-sm text-muted-foreground">
                  Download all certification data as JSON file
                </p>
              </div>
              <Button 
                onClick={handleExport}
                disabled={exporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-green-500" />
                <div className="mt-2">
                  <h3 className="font-semibold">Import Certifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload JSON file to import certification data
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="import-file">Select File</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={importing}
                />
              </div>
              
              {importing && (
                <div className="text-center text-sm text-muted-foreground">
                  Importing data...
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;
