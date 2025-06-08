
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, Plus } from 'lucide-react';
import { DocumentCategory } from '@/types/enums';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  fileSize: string;
  lastModified: string;
}

const DocumentTemplates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');

  const templates: DocumentTemplate[] = [
    {
      id: '1',
      name: 'Standard Operating Procedure Template',
      description: 'Basic SOP template for food safety procedures',
      category: DocumentCategory.SOP,
      fileSize: '245 KB',
      lastModified: '2024-03-15',
    },
    {
      id: '2',
      name: 'HACCP Plan Template',
      description: 'Comprehensive HACCP plan template',
      category: DocumentCategory.HACCP_Plan,
      fileSize: '512 KB',
      lastModified: '2024-03-10',
    },
    {
      id: '3',
      name: 'Inspection Checklist',
      description: 'Daily inspection checklist form',
      category: DocumentCategory.Form,
      fileSize: '128 KB',
      lastModified: '2024-03-12',
    },
    {
      id: '4',
      name: 'Training Record Form',
      description: 'Employee training completion form',
      category: DocumentCategory.Form,
      fileSize: '92 KB',
      lastModified: '2024-03-08',
    },
    {
      id: '5',
      name: 'Quality Policy Document',
      description: 'Company quality policy template',
      category: DocumentCategory.Policy,
      fileSize: '324 KB',
      lastModified: '2024-03-05',
    },
    {
      id: '6',
      name: 'Cleaning SOP',
      description: 'Standard cleaning procedure',
      category: DocumentCategory.SOP,
      fileSize: '198 KB',
      lastModified: '2024-03-03',
    },
    {
      id: '7',
      name: 'Corrective Action Form',
      description: 'CAPA initiation form',
      category: DocumentCategory.Form,
      fileSize: '156 KB',
      lastModified: '2024-03-01',
    },
    {
      id: '8',
      name: 'Audit Checklist',
      description: 'Internal audit checklist',
      category: DocumentCategory.Form,
      fileSize: '201 KB',
      lastModified: '2024-02-28',
    },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.SOP:
        return 'bg-blue-100 text-blue-800';
      case DocumentCategory.HACCP_Plan:
        return 'bg-green-100 text-green-800';
      case DocumentCategory.Form:
        return 'bg-yellow-100 text-yellow-800';
      case DocumentCategory.Policy:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = Object.values(DocumentCategory);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Document Templates</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'all')}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <Badge className={getCategoryColor(template.category)}>
                  {template.category.replace(/_/g, ' ')}
                </Badge>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>{template.fileSize}</span>
                <span>Modified: {template.lastModified}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Preview
                </Button>
                <Button size="sm" className="flex-1">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentTemplates;
