import { ObjectId } from 'mongodb';

export type PromptCategory = 'Développement' | 'Design' | 'Marketing' | 'Business' | 'Productivité' | 'Autre';
export type PromptDifficulty = 'Débutant' | 'Intermédiaire' | 'Avancé';

export interface IPrompt {
  _id?: ObjectId;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  difficulty: PromptDifficulty;
  tags: string[];
  usageCount: number;
  likes: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
} 