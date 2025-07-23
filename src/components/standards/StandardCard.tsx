import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Calendar, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  ExternalLink,
  Edit,
  Zap,
  BarChart3,
  Shield
} from 'lucide-react';
import { FacilityStandard, COMPLIANCE_COLORS } from '@/types/standards';
import { format } from 'date-fns';

interface StandardCardProps {
  standard: FacilityStandard;
  onView?: (standard: FacilityStandard) => void;
  onEdit?: (standard: FacilityStandard) => void;
  onGenerateCAPA?: (standard: FacilityStandard) => void;
  showFacilityInfo?: boolean;
}

const StandardCard: React.FC<StandardCardProps> = ({
  standard,
  onView,
  onEdit,
  onGenerateCAPA,
  showFacilityInfo = false
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Certified':
        return <Award className="h-4 w-4" />;
      case 'Compliant':
        return <CheckCircle className="h-4 w-4" />;
      case 'Expired':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Non-Compliant':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getComplianceScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isExpiringSoon = (expiryDate?: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow && expiry >= new Date();
  };

  const isExpired = (expiryDate?: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const colors = COMPLIANCE_COLORS[standard.compliance_status as keyof typeof COMPLIANCE_COLORS] || COMPLIANCE_COLORS['Not Started'];

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        standard.compliance_status === 'Certified' ? 'bg-emerald-500' :
        standard.compliance_status === 'Compliant' ? 'bg-green-500' :
        standard.compliance_status === 'In Progress' ? 'bg-blue-500' :
        standard.compliance_status === 'Non-Compliant' ? 'bg-red-500' :
        standard.compliance_status === 'Expired' ? 'bg-orange-500' :
        'bg-gray-300'
      }`} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1 truncate">
              {standard.standard_name || 'Unknown Standard'}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="truncate">
                {standard.standard_code} {standard.standard_version && `v${standard.standard_version}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {getStatusIcon(standard.compliance_status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Authority Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            className={`${colors.bg} ${colors.text} ${colors.border} border`}
            variant="secondary"
          >
            {standard.compliance_status}
          </Badge>
          {standard.standard_authority && (
            <Badge variant="outline">
              {standard.standard_authority}
            </Badge>
          )}
          {isExpiringSoon(standard.expiry_date) && (
            <Badge variant="destructive" className="animate-pulse">
              Expiring Soon
            </Badge>
          )}
          {isExpired(standard.expiry_date) && (
            <Badge variant="destructive">
              Expired
            </Badge>
          )}
        </div>

        {/* Facility Information */}
        {showFacilityInfo && standard.facility_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded">
            <Building className="h-4 w-4" />
            <span className="truncate">{standard.facility_name}</span>
          </div>
        )}

        {/* Compliance Score */}
        {standard.compliance_score && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Compliance Score</span>
              </div>
              <span className={`font-semibold ${getComplianceScoreColor(standard.compliance_score)}`}>
                {standard.compliance_score}%
              </span>
            </div>
            <Progress 
              value={standard.compliance_score} 
              className="h-2"
            />
          </div>
        )}

        {/* Key Dates */}
        <div className="space-y-2 text-sm">
          {standard.certification_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>Certified: {format(new Date(standard.certification_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {standard.expiry_date && (
            <div className={`flex items-center gap-2 ${
              isExpired(standard.expiry_date) ? 'text-red-600' :
              isExpiringSoon(standard.expiry_date) ? 'text-orange-600' :
              'text-muted-foreground'
            }`}>
              <Calendar className="h-4 w-4" />
              <span>
                Expires: {format(new Date(standard.expiry_date), 'MMM d, yyyy')}
                {isExpiringSoon(standard.expiry_date) && (
                  <span className="ml-1 text-xs">⚠️</span>
                )}
              </span>
            </div>
          )}

          {standard.next_audit_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Next Audit: {format(new Date(standard.next_audit_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {/* Compliance Stats */}
        {(standard.non_conformities_count !== undefined || standard.capa_actions_count !== undefined) && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            {standard.non_conformities_count !== undefined && (
              <div className="text-center">
                <p className="text-lg font-semibold text-orange-600">
                  {standard.non_conformities_count}
                </p>
                <p className="text-xs text-muted-foreground">Non-Conformities</p>
              </div>
            )}
            {standard.capa_actions_count !== undefined && (
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">
                  {standard.capa_actions_count}
                </p>
                <p className="text-xs text-muted-foreground">CAPA Actions</p>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {standard.standard_description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {standard.standard_description}
          </p>
        )}

        {/* Notes */}
        {standard.notes && (
          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 line-clamp-2">
              {standard.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onView && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView(standard)}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
          
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(standard)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onGenerateCAPA && (standard.compliance_status === 'Non-Compliant' || standard.non_conformities_count && standard.non_conformities_count > 0) && (
            <Button 
              size="sm" 
              onClick={() => onGenerateCAPA(standard)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              CAPA
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardCard;