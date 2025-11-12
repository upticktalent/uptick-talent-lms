import { type LucideIcon } from 'lucide-react';

// NavMain Props
export interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}

// NavUser Props
export interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}
