"use client";

import { IFormation } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';
import { FormationApi, ChapterApi } from './apiService';

export const FormationService = {
  getAllFormations: async () => {
    try {
      return await FormationApi.getAll();
    } catch (error) {
      console.error('Error fetching formations:', error);
      return [];
    }
  },

  getFormationById: async (id: string) => {
    try {
      return await FormationApi.getById(id);
    } catch (error) {
      console.error('Error fetching formation:', error);
      return null;
    }
  },

  createFormation: async (formationData: Partial<IFormation>) => {
    try {
      return await FormationApi.create(formationData);
    } catch (error) {
      console.error('Error creating formation:', error);
      throw error;
    }
  },

  updateFormation: async (id: string, formationData: Partial<IFormation>) => {
    try {
      return await FormationApi.update(id, formationData);
    } catch (error) {
      console.error('Error updating formation:', error);
      return null;
    }
  },

  deleteFormation: async (id: string) => {
    try {
      await FormationApi.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting formation:', error);
      return false;
    }
  },

  updateModuleStatus: async (formationId: string, moduleId: number, completed: boolean) => {
    try {
      return await FormationApi.updateModuleStatus(formationId, moduleId, completed);
    } catch (error) {
      console.error('Error updating module status:', error);
      return null;
    }
  }
};

export const ChapterService = {
  getAllChapters: async () => {
    try {
      return await ChapterApi.getAll();
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  },

  getChapterById: async (id: string) => {
    try {
      return await ChapterApi.getById(id);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }
  },

  createChapter: async (chapterData: Partial<IChapter>) => {
    try {
      return await ChapterApi.create(chapterData);
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw error;
    }
  },

  updateChapter: async (id: string, chapterData: Partial<IChapter>) => {
    try {
      return await ChapterApi.update(id, chapterData);
    } catch (error) {
      console.error('Error updating chapter:', error);
      return null;
    }
  },

  deleteChapter: async (id: string) => {
    try {
      await ChapterApi.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting chapter:', error);
      return false;
    }
  },

  getChaptersByFormation: async (formationId: string) => {
    try {
      return await ChapterApi.getByFormation(formationId);
    } catch (error) {
      console.error('Error fetching chapters by formation:', error);
      return [];
    }
  }
}; 