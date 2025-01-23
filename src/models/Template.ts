import { ObjectId } from 'mongodb';

export interface ITemplate {
  _id?: ObjectId;
  title: string;
  description: string;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
} 