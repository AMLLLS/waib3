import { MongoDocument } from '@/types/mongodb';

export interface IModule {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  current?: boolean;
}

export interface IResource {
  name: string;
  size: string;
  url: string;
}

export interface IInstructor {
  name: string;
  role: string;
  avatar: string;
}

export interface IFormation extends MongoDocument {
  title: string;
  description: string;
  content: string;
  duration: string;
  status: 'draft' | 'published';
  order: number;
  level: string;
  category: string;
  chapterId: string;
  coverImage?: string;
  instructor: IInstructor;
  modules: IModule[];
  resources: IResource[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
} 