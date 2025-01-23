import { MongoDocument } from '@/types/mongodb';

export interface IChapter extends MongoDocument {
  title: string;
  description: string;
  order: number;
  status: 'draft' | 'published';
  formationId?: string;
  createdAt: Date;
  updatedAt: Date;
} 