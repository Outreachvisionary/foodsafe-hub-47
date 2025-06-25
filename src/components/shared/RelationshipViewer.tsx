
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  FileText, 
  AlertTriangle, 
  ClipboardList, 
  GraduationCap,
  Search,
  Link,
  Plus
} from 'lucide-react';
import { useModuleRelationships } from '@/hooks/useModuleRelationships';
import { moduleIntegrationService } from '@/services/moduleIntegrationService';
import { useAuth } from '@/contexts/AuthContext';

interface RelationshipViewerProps {
  sourceId: string;
  sourceType: string;
  sourceTitle: string;
  onCreateRelationship?: () => void;
}

const RelationshipViewer: React.FC<RelationshipViewerProps> = ({
  sourceId,
  sourceType,
  sourceTitle,
  onCreateRelationship
}) => {
  const { user } = useAuth();
  const { relationships, isLoading, triggerWorkflow, isTriggeringWorkflow } = useModuleRelationships(
    sourceId, 
    sourceType
  );

  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case 'audit':
      case 'audit-finding':
        return <Search className="h-4 w-4" />;
      case 'non-conformance':
        return <AlertTriangle className="h-4 w-4" />;
      case 'capa':
        return <ClipboardList className="h-4 w-4" />;
      case 'training':
        return <GraduationCap className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  const getRelationshipBadge = (relationshipType: string) => {
    const types = {
      'generated-from': 'bg-blue-100 text-blue-800',
      'requires': 'bg-orange-100 text-orange-800',
      'references': 'bg-green-100 text-green-800',
      'triggers': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={types[relationshipType as keyof typeof types] || 'bg-gray-100 text-gray-800'}>
        {relationshipType.replace('-', ' ')}
      </Badge>
    );
  };

  const handleWorkflowTrigger = (workflowType: string, data: any) => {
    if (!user) return;
    
    const workflowData = {
      ...data,
      userId: user.id,
      sourceTitle: sourceTitle
    };
    
    triggerWorkflow({ workflowType, data: workflowData });
  };

  const getWorkflowSuggestions = () => {
    // Get suggestions based on the source type and current state
    const suggestions = moduleIntegrationService.getWorkflowSuggestions(sourceType, 'active', {
      severity: 'major' // This would come from the actual item data
    });
    
    return suggestions;
  };

  const getWorkflowTypeFromSuggestion = (suggestion: string): string => {
    const mappings = {
      'Create Non-Conformance': 'audit-finding-to-nc',
      'Generate CAPA': 'nc-to-capa',
      'Assign Training': 'capa-to-training'
    };
    
    return mappings[suggestion as keyof typeof mappings] || suggestion.toLowerCase().replace(/\s+/g, '-');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Related Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading relationships...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Related Items
          </div>
          {onCreateRelationship && (
            <Button size="sm" variant="outline" onClick={onCreateRelationship}>
              <Plus className="h-4 w-4 mr-1" />
              Link Item
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relationships.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No related items found
          </div>
        ) : (
          <div className="space-y-3">
            {relationships.map((relationship) => (
              <div key={relationship.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getModuleIcon(relationship.target_type)}
                  <div className="flex-1">
                    <div className="font-medium">
                      {relationship.target_type.replace('-', ' ')} #{relationship.target_id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created {relationship.created_at ? new Date(relationship.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  {getRelationshipBadge(relationship.relationship_type)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workflow Suggestions */}
        {getWorkflowSuggestions().length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Suggested Actions</h4>
            <div className="space-y-2">
              {getWorkflowSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isTriggeringWorkflow || !user}
                  onClick={() => {
                    const workflowType = getWorkflowTypeFromSuggestion(suggestion);
                    handleWorkflowTrigger(workflowType, {
                      findingTitle: sourceTitle,
                      findingDescription: `Generated from ${sourceType}`,
                      assignedTo: user?.email || 'system',
                      severity: 'major'
                    });
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelationshipViewer;
