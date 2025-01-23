'use client';

import { WithClientId } from '@/types/server';
import { IFormation } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class AdminError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminError';
  }
}

export interface StatsResponse {
  totalFormations: number;
  totalUsers: number;
  totalChapters: number;
  publishedFormations: number;
  draftFormations: number;
}

function getAuthHeaders(): Record<string, string> {
  const token = Cookies.get('adminToken');
  console.log('Token from cookies:', token);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  console.log('Headers being sent:', headers);
  return headers;
}

export async function getStats(): Promise<StatsResponse> {
  try {
    console.log('Getting stats...');
    const headers = getAuthHeaders();
    console.log('Using headers:', headers);
    const url = `${API_URL}/api/admin`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include',
      cache: 'no-store'
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stats API error:', errorText);
      throw new Error(`Failed to fetch stats: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Stats received:', data);
    return data;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw new AdminError('Erreur lors de la récupération des statistiques');
  }
}

export async function publishFormation(formationId: string): Promise<boolean> {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/api/admin/formations/${formationId}/publish`, {
      method: 'POST',
      headers,
      credentials: 'include',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to publish formation');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error publishing formation:', error);
    throw new AdminError('Erreur lors de la publication de la formation');
  }
}

export async function unpublishFormation(formationId: string): Promise<boolean> {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/api/admin/formations/${formationId}/unpublish`, {
      method: 'POST',
      headers,
      credentials: 'include',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to unpublish formation');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error unpublishing formation:', error);
    throw new AdminError('Erreur lors de la dépublication de la formation');
  }
}

export async function duplicateFormation(formationId: string): Promise<string> {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/api/admin/formations/${formationId}/duplicate`, {
      method: 'POST',
      headers,
      credentials: 'include',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to duplicate formation');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error duplicating formation:', error);
    throw new AdminError('Erreur lors de la duplication de la formation');
  }
} 