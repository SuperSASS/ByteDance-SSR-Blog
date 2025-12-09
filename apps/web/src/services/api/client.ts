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

/**
 * API 调用基础封装
 *
 * @param endpoint API 路径
 * @param headers HTTP 头
 * @returns API 响应数据
 * @throws API 调用失败
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    //credentials: "include", // TODO: 这个目前还不明白，为什么 cookie 不会自动带上，目前是手动加的
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `API Error: ${response.status} ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}

export { API_BASE_URL };
