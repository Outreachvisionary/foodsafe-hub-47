
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Plus, Copy, FolderOpen } from 'lucide-react';
import { DocumentCategory } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  lastUpdated: string;
  format: string;
  isRequired: boolean;
  standardReference?: string;
}

const templateCategories = [
  { name: 'SOPs', icon: <FileText className="h-6 w-6 text-blue-500" /> },
  { name: 'Policies', icon: <FileText className="h-6 w-6 text-purple-500" /> },
  { name: 'Forms', icon: <FileText className="h-6 w-6 text-green-500" /> },
  { name: 'HACCP Plans', icon: <FileText className="h-6 w-6 text-orange-500" /> },
  { name: 'Audit Checklists', icon: <FileText className="h-6 w-6 text-red-500" /> },
  { name: 'All Templates', icon: <FolderOpen className="h-6 w-6 text-gray-500" /> },
];

const documentTemplates: DocumentTemplate[] = [
  {
    id: '1',
    title: 'SOP Template',
    description: 'Standard Operating Procedure template with all required sections for compliance',
    category: 'SOP',
    lastUpdated: '2023-08-15',
    format: 'DOCX',
    isRequired: true,
    standardReference: 'SQF, FSSC 22000'
  },
  {
    id: '2',
    title: 'HACCP Plan Template',
    description: 'Comprehensive HACCP plan template with hazard analysis and critical control points',
    category: 'HACCP Plan',
    lastUpdated: '2023-09-02',
    format: 'DOCX',
    isRequired: true,
    standardReference: 'SQF, FSSC 22000, BRC'
  },
  {
    id: '3',
    title: 'Supplier Approval Form',
    description: 'Form for collecting and reviewing supplier compliance information',
    category: 'Form',
    lastUpdated: '2023-07-30',
    format: 'DOCX',
    isRequired: true,
    standardReference: 'SQF'
  },
  {
    id: '4',
    title: 'Internal Audit Checklist',
    description: 'Comprehensive audit checklist aligned with GFSI standards',
    category: 'Form',
    lastUpdated: '2023-09-15',
    format: 'DOCX',
    isRequired: true,
    standardReference: 'All Standards'
  },
  {
    id: '5',
    title: 'Food Safety Policy Template',
    description: 'Template for creating a comprehensive food safety policy document',
    category: 'Policy',
    lastUpdated: '2023-08-20',
    format: 'DOCX',
    isRequired: true,
    standardReference: 'All Standards'
  },
  {
    id: '6',
    title: 'Allergen Control Plan',
    description: 'Template for documenting allergen control measures',
    category: 'SOP',
    lastUpdated: '2023-09-10',
    format: 'DOCX',
    isRequired: true,
    standardReference: 'SQF, BRC'
  },
  {
    id: '7',
    title: 'Training Record Form',
    description: 'Form for documenting employee training completion',
    category: 'Form',
    lastUpdated: '2023-07-15',
    format: 'DOCX',
    isRequired: false
  },
  {
    id: '8',
    title: 'Nonconformance Report',
    description: 'Form for documenting and tracking non-conformances',
    category: 'Form',
    lastUpdated: '2023-08-05',
    format: 'DOCX',
    isRequired: true,
    standardReference: 'All Standards'
  }
];

const DocumentTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Templates');
  const { toast } = useToast();
  
  const filteredTemplates = documentTemplates.filter(template => {
    const matchesSearch = 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All Templates' ? true : 
      (selectedCategory === 'SOPs' && template.category === 'SOP') ||
      (selectedCategory === 'Policies' && template.category === 'Policy') ||
      (selectedCategory === 'Forms' && template.category === 'Form') ||
      (selectedCategory === 'HACCP Plans' && template.category === 'HACCP Plan') ||
      (selectedCategory === 'Audit Checklists' && template.category === 'Form' && template.title.includes('Audit'));
    
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (template: DocumentTemplate) => {
    toast({
      title: "Template downloaded",
      description: `${template.title} has been downloaded successfully.`,
    });
  };

  const handleUseTemplate = (template: DocumentTemplate) => {
    toast({
      title: "Template copied",
      description: `A new document based on ${template.title} has been created.`,
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Document Templates</CardTitle>
        <CardDescription>
          Standardized templates for creating consistent documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {templateCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className="flex items-center gap-2"
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="h-full hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 ml-2">{template.format}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span>{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated:</span>
                    <span>{template.lastUpdated}</span>
                  </div>
                  {template.standardReference && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Standards:</span>
                      <span>{template.standardReference}</span>
                    </div>
                  )}
                  {template.isRequired && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Required:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(template)}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" onClick={() => handleUseTemplate(template)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {/* New Template Card */}
          <Card className="h-full border-dashed hover:shadow-md transition-all flex flex-col items-center justify-center cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <Plus className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-medium text-lg mb-2">Create New Template</h3>
              <p className="text-center text-gray-500">
                Create a custom document template for your organization
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplates;
