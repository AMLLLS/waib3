export interface Chapter {
  _id?: string;
  title: string;
  description: string;
  order: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface Formation {
  _id?: string;
  chapterId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  order: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  duration?: number;
  notes?: string[];
} 