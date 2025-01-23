'use client';

import { IFormation } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';
import { ITemplate } from '@/models/Template';
import Cookies from 'js-cookie';
import { IPrompt } from '@/models/Prompt';
import { ObjectId } from 'mongodb';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiError extends Error {
  status?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = new Error('Une erreur est survenue');
    error.status = response.status;
    const data = await response.json().catch(() => ({}));
    error.message = data.error || error.message;
    throw error;
  }
  return response.json();
}

function getAuthHeaders(): HeadersInit {
  const adminToken = Cookies.get('adminToken');
  const userToken = Cookies.get('userToken');
  const token = adminToken || userToken;
  
  console.log('Token from cookies:', token);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  console.log('Headers being sent:', headers);
  return headers;
}

export const FormationApi = {
  getAll: async (): Promise<IFormation[]> => {
    try {
      console.log('Fetching all formations...');
      const headers = getAuthHeaders();
      console.log('Using headers:', headers);
      const url = `${API_URL}/api/formations`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        headers,
        credentials: 'include',
        cache: 'no-store'
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch formations: ${response.status} ${errorText}`);
      }
      
      const formations = await response.json();
      console.log('Formations received:', formations);
      return formations.sort((a: IFormation, b: IFormation) => a.order - b.order);
    } catch (error) {
      console.error('Error fetching formations:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<IFormation> => {
    try {
      const response = await fetch(`${API_URL}/api/formations/${id}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse<IFormation>(response);
    } catch (error) {
      console.error('Error fetching formation:', error);
      throw error;
    }
  },

  create: async (data: Partial<IFormation>): Promise<IFormation> => {
    try {
      const response = await fetch(`${API_URL}/api/formations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<IFormation>(response);
    } catch (error) {
      console.error('Error creating formation:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<IFormation>): Promise<IFormation> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/formations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<IFormation>(response);
    } catch (error) {
      console.error('Error updating formation:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/formations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting formation:', error);
      throw error;
    }
  },

  updateModuleStatus: async (formationId: string, moduleId: number, completed: boolean): Promise<IFormation> => {
    try {
      const formation = await FormationApi.getById(formationId);
      const moduleIndex = formation.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) throw new Error('Module non trouvé');

      const updatedModules = [...formation.modules];
      updatedModules[moduleIndex].completed = completed;

      // Mettre à jour le module courant
      updatedModules.forEach((module, index) => {
        module.current = index === moduleIndex + 1 && !module.completed;
      });

      return await FormationApi.update(formationId, { modules: updatedModules });
    } catch (error) {
      console.error('Error updating module status:', error);
      throw error;
    }
  }
};

export const ChapterApi = {
  getAll: async (): Promise<IChapter[]> => {
    try {
      const response = await fetch(`${API_URL}/api/chapters`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const chapters = await handleResponse<IChapter[]>(response);
      return chapters.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<IChapter> => {
    try {
      const response = await fetch(`${API_URL}/api/chapters/${id}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse<IChapter>(response);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw error;
    }
  },

  create: async (data: Partial<IChapter>): Promise<IChapter> => {
    try {
      const response = await fetch(`${API_URL}/api/chapters`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<IChapter>(response);
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<IChapter>): Promise<IChapter> => {
    try {
      const response = await fetch(`${API_URL}/api/chapters/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<IChapter>(response);
    } catch (error) {
      console.error('Error updating chapter:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/chapters/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      throw error;
    }
  },

  getByFormation: async (formationId: string): Promise<IChapter[]> => {
    try {
      const response = await fetch(`${API_URL}/api/chapters/formation/${formationId}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const chapters = await handleResponse<IChapter[]>(response);
      return chapters.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error fetching chapters by formation:', error);
      throw error;
    }
  }
};

export const TemplateApi = {
  getAll: async (): Promise<ITemplate[]> => {
    try {
      const response = await fetch(`${API_URL}/api/templates`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse<ITemplate[]>(response);
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<ITemplate> => {
    try {
      const response = await fetch(`${API_URL}/api/templates/${id}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse<ITemplate>(response);
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  create: async (data: Partial<ITemplate>): Promise<ITemplate> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<ITemplate>(response);
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<ITemplate>): Promise<ITemplate> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/templates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<ITemplate>(response);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};

export const PromptApi = {
  getAll: async (): Promise<IPrompt[]> => {
    try {
      const response = await fetch(`${API_URL}/api/prompts`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse<IPrompt[]>(response);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<IPrompt> => {
    try {
      const response = await fetch(`${API_URL}/api/prompts/${id}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      return handleResponse<IPrompt>(response);
    } catch (error) {
      console.error('Error fetching prompt:', error);
      throw error;
    }
  },

  create: async (data: Partial<IPrompt>): Promise<IPrompt> => {
    try {
      const response = await fetch(`${API_URL}/api/prompts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<IPrompt>(response);
    } catch (error) {
      console.error('Error creating prompt:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<IPrompt>): Promise<IPrompt> => {
    try {
      const response = await fetch(`${API_URL}/api/prompts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<IPrompt>(response);
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/prompts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  },

  like: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/prompts/${id}/like`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error liking prompt:', error);
      throw error;
    }
  },

  incrementUsage: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/prompts/${id}/use`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error incrementing prompt usage:', error);
      throw error;
    }
  }
}; 