
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { LucideIcon } from 'lucide-react';

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
}

export function FormSection({ title, children, icon: Icon }: FormSectionProps) {
  return (
    <Card className="border shadow-sm mb-6">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
}
