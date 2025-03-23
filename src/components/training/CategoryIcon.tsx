
import React from 'react';
import { Thermometer, Banana, Users, FileText, AlertTriangle, Bug, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { FoodSafetyCategory } from '@/hooks/useAuditTraining';

interface CategoryIconProps {
  category?: FoodSafetyCategory;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "h-5 w-5" }) => {
  switch (category) {
    case 'temperature-control':
      return <Thermometer className={`${className} text-blue-600`} />;
    case 'allergen-control':
      return <Banana className={`${className} text-yellow-600`} />;
    case 'hygiene-monitoring':
      return <Users className={`${className} text-green-600`} />;
    case 'documentation':
      return <FileText className={`${className} text-amber-600`} />;
    case 'sanitization':
      return <AlertTriangle className={`${className} text-purple-600`} />;
    case 'pest-control':
      return <Bug className={`${className} text-orange-600`} />;
    case 'foreign-material':
      return <Sparkles className={`${className} text-indigo-600`} />;
    case 'traceability':
      return <AlertCircle className={`${className} text-red-600`} />;
    default:
      return <BookOpen className={`${className} text-blue-600`} />;
  }
};

export default CategoryIcon;
