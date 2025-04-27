
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}
