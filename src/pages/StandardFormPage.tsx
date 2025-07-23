import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useCreateRegulatoryStandard, useUpdateRegulatoryStandard, useRegulatoryStandard } from '@/hooks/useStandards';
import { REGULATORY_AUTHORITIES, STANDARD_CATEGORIES } from '@/types/standards';
import { toast } from 'sonner';

const StandardFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { data: existingStandard, isLoading: isLoadingStandard } = useRegulatoryStandard(id || '');
  const createMutation = useCreateRegulatoryStandard();
  const updateMutation = useUpdateRegulatoryStandard();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    authority: '',
    version: '',
    category: 'Food Safety',
    scope: '',
    certification_body: '',
    annual_fee: '',
    renewal_period_months: '36',
    is_mandatory: false,
    geographical_scope: [] as string[],
    industry_sectors: [] as string[],
    documentation_url: ''
  });

  // Update form when editing existing standard
  React.useEffect(() => {
    if (existingStandard && isEditing) {
      setFormData({
        name: existingStandard.name || '',
        code: existingStandard.code || '',
        description: existingStandard.description || '',
        authority: existingStandard.authority || '',
        version: existingStandard.version || '',
        category: existingStandard.category || 'Food Safety',
        scope: existingStandard.scope || '',
        certification_body: existingStandard.certification_body || '',
        annual_fee: existingStandard.annual_fee?.toString() || '',
        renewal_period_months: existingStandard.renewal_period_months?.toString() || '36',
        is_mandatory: existingStandard.is_mandatory || false,
        geographical_scope: existingStandard.geographical_scope || [],
        industry_sectors: existingStandard.industry_sectors || [],
        documentation_url: existingStandard.documentation_url || ''
      });
    }
  }, [existingStandard, isEditing]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInput = (field: 'geographical_scope' | 'industry_sectors', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    handleInputChange(field, items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.authority) {
      toast.error('Please fill in all required fields');
      return;
    }

    const standardData = {
      ...formData,
      annual_fee: formData.annual_fee ? parseFloat(formData.annual_fee) : null,
      renewal_period_months: parseInt(formData.renewal_period_months) || 36,
      status: 'active'
    };

    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, updates: standardData });
        toast.success('Standard updated successfully');
      } else {
        await createMutation.mutateAsync(standardData);
        toast.success('Standard created successfully');
      }
      navigate('/standards');
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingStandard) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/standards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Standards
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Standard' : 'Add New Standard'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update regulatory standard information' : 'Create a new regulatory standard'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Standard Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., ISO 22000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Standard Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="e.g., ISO22000:2018"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the standard..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authority">Authority *</Label>
                <Select 
                  value={formData.authority} 
                  onValueChange={(value) => handleInputChange('authority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select authority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REGULATORY_AUTHORITIES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="e.g., 2018"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(STANDARD_CATEGORIES).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scope">Scope</Label>
                <Input
                  id="scope"
                  value={formData.scope}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  placeholder="e.g., Manufacturing, Retail"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certification_body">Certification Body</Label>
                <Input
                  id="certification_body"
                  value={formData.certification_body}
                  onChange={(e) => handleInputChange('certification_body', e.target.value)}
                  placeholder="e.g., SGS, Bureau Veritas"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annual_fee">Annual Fee (USD)</Label>
                <Input
                  id="annual_fee"
                  type="number"
                  value={formData.annual_fee}
                  onChange={(e) => handleInputChange('annual_fee', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="renewal_period">Renewal Period (Months)</Label>
                <Input
                  id="renewal_period"
                  type="number"
                  value={formData.renewal_period_months}
                  onChange={(e) => handleInputChange('renewal_period_months', e.target.value)}
                  placeholder="36"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="geographical_scope">Geographical Scope (comma-separated)</Label>
              <Input
                id="geographical_scope"
                value={formData.geographical_scope.join(', ')}
                onChange={(e) => handleArrayInput('geographical_scope', e.target.value)}
                placeholder="e.g., Global, United States, Europe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry_sectors">Industry Sectors (comma-separated)</Label>
              <Input
                id="industry_sectors"
                value={formData.industry_sectors.join(', ')}
                onChange={(e) => handleArrayInput('industry_sectors', e.target.value)}
                placeholder="e.g., Food Manufacturing, Agriculture"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentation_url">Documentation URL</Label>
              <Input
                id="documentation_url"
                type="url"
                value={formData.documentation_url}
                onChange={(e) => handleInputChange('documentation_url', e.target.value)}
                placeholder="https://example.com/standard-docs"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_mandatory"
                checked={formData.is_mandatory}
                onCheckedChange={(checked) => handleInputChange('is_mandatory', checked)}
              />
              <Label htmlFor="is_mandatory">This standard is mandatory for our industry</Label>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/standards')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Standard' : 'Create Standard'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StandardFormPage;