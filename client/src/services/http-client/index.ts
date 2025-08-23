export interface IHttpClient {
  get<T>(endpoint: string): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
  request<T>(endpoint: string, config?: RequestInit): Promise<ApiResponse<T>>;
  constructQueryString(params: Record<string, string>): Promise<string>;
  resetRefreshState(): void;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export class HttpClient implements IHttpClient {
  private baseURL: string;
  private refreshAttempts: number = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 1;
  private isRefreshing: boolean = false;

  constructor(baseURL?: string) {
    this.baseURL =
      baseURL || import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  }

  private async handleResponse<T>(
    response: Response,
    endpoint: string,
    originalConfig: RequestInit = {},
    retryRefresh = true
  ): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (response.ok) {
      const data = isJson ? await response.json() : await response.text();
      return { data, status: response.status };
    }

    const errorResponse = isJson
      ? await response.json()
      : await response.text();
    const errorMessage =
      typeof errorResponse === "string"
        ? errorResponse
        : errorResponse.message || "";

    if (response.status === 401 && retryRefresh) {
      if (
        this.refreshAttempts < this.MAX_REFRESH_ATTEMPTS &&
        !this.isRefreshing
      ) {
        this.refreshAttempts++;
        this.isRefreshing = true;

        try {
          const refreshResult = await this.tryRefreshToken();
          if (refreshResult) {
            this.isRefreshing = false;
            const retryResponse = await this.request<T>(
              endpoint,
              originalConfig,
              false
            );

            this.refreshAttempts = 0;
            return retryResponse;
          }
        } finally {
          this.isRefreshing = false;
        }
      }

      this.refreshAttempts = 0;
      return {
        error: errorMessage || "Unauthorized",
        status: response.status,
      };
    }

    return {
      error: errorMessage,
      status: response.status,
    };
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async constructQueryString(params: Record<string, string>): Promise<string> {
    const paramsString = new URLSearchParams(params).toString();
    return paramsString ? `?${paramsString}` : "";
  }

  async request<T>(
    endpoint: string,
    config: RequestInit = {},
    retryRefresh = true
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
      });

      return await this.handleResponse<T>(
        response,
        endpoint,
        config,
        retryRefresh
      );
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  resetRefreshState(): void {
    this.refreshAttempts = 0;
    this.isRefreshing = false;
  }
}
