// 前端API调用基础封装
// 用于SSR和CSR环境

const isServer = typeof window === 'undefined';

// 根据环境确定API base URL
function getApiBaseUrl(): string {
  if (isServer) {
    // SSR环境：使用内网地址
    return process.env.API_BASE_URL || 'http://localhost:3000/api';
  } else {
    // CSR环境：使用相对路径
    return '/api';
  }
}

const API_BASE_URL = getApiBaseUrl();

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export { API_BASE_URL };
