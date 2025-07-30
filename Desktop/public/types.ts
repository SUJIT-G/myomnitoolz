export enum PageKey {
  HOME = 'home',
  ABOUT = 'about',
  TERMS = 'terms',
  PRIVACY = 'privacy',
  FITNESS = 'fitness',
  SEO = 'seo',
  // DIGITAL = 'digital', // Removed
  IMAGE = 'image',
}

export type ToolCategoryKey = PageKey.FITNESS | PageKey.SEO | PageKey.IMAGE; // Removed PageKey.DIGITAL

export interface Tool {
  id: string;
  name: string;
  line1: string; // Corresponds to the first descriptive paragraph, often features
  line2?: string; // Corresponds to the second descriptive paragraph, often unique touch/feature
  isPro?: boolean; // Indicates if the tool is a "Pro" feature
}

export enum ToolCategory {
  FITNESS = "Fitness & Health Tools",
  SEO = "SEO Tools",
  // DIGITAL_ASSETS = "Digital Asset Tools", // Removed
  IMAGE_TOOLS = "Image Tools",
}

export interface NavLinkItem {
  path: string;
  label: string;
  pageKey?: PageKey; // For simple pages
}

export interface ToolCategoryLink extends NavLinkItem {
  pageKey: PageKey; // For tool category pages specifically
}

export interface Feedback {
  id: string; // Unique ID, e.g., toolId_timestamp
  toolId: string;
  toolName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
  userName?: string; // Optional, "Anonymous" or simulated name
  isTestimonial: boolean;
}