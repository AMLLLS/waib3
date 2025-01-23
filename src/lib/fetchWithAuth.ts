import Cookies from 'js-cookie';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = Cookies.get('adminToken');
  console.log('Token from cookies for fetch:', token ? `${token.substring(0, 20)}...` : 'No token');
  
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
  };

  console.log('Request URL:', url);
  console.log('Request headers:', headers);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('Response status:', response.status);

  if (response.status === 401) {
    console.log('Unauthorized response, clearing token and redirecting...');
    // Token invalide ou expiré
    Cookies.remove('adminToken');
    window.location.href = '/admin/login';
    throw new Error('Session expirée');
  }

  return response;
} 