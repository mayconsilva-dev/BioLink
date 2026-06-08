import {
  BookOpen,
  Facebook,
  Github,
  Globe,
  Instagram,
  Link,
  Linkedin,
  Mail,
  MessageCircle,
  Music,
  Phone,
  ShoppingBag,
  Twitter,
  Video,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import type { LucideIconName } from '../types';

const iconMap: Record<LucideIconName, LucideIcon> = {
  Globe,
  Link,
  MessageCircle,
  ShoppingBag,
  BookOpen,
  Mail,
  Instagram,
  Youtube,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Music,
  Video,
  Phone,
};

export function getLucideIcon(name: LucideIconName): LucideIcon {
  return iconMap[name] ?? Link;
}
