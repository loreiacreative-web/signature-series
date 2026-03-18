export type Archetype =
  | 'Myth Buster'
  | 'How-To'
  | 'Behind the Scenes'
  | 'Customer Spotlight'
  | 'AMA'
  | 'Problem Solver'
  | 'Industry Insider'
  | 'Product Deep Dive'
  | 'Storytime'
  | 'Trend Watch';

export interface FormData {
  businessName: string;
  product: string;
  personality: string[];
  feeling: string;
  idealCustomer: string;
  coreQuestion: string;
  misconception: string;
  struggle: string;
  frequency: string;
  passionTopic: string;
  email?: string;
}

export interface Episode {
  id: number;
  title: string;
  description: string;
}

export interface Result {
  archetype: string;
  seriesNames: string[];
  whyItWorks: string;
  episodes: Episode[];
}

export const PERSONALITY_OPTIONS = [
  'Playful', 'Authoritative', 'Warm', 'Edgy', 'Minimalist', 'Bold', 
  'Nurturing', 'Witty', 'Luxury', 'Relatable', 'Quirky', 'Professional'
];

export const FREQUENCY_OPTIONS = [
  'Daily', '3–5x week', '1–2x week', 'Whenever I remember'
];
