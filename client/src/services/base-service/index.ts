import type { IHttpClient, ApiResponse } from "../http-client";
import { HttpClient } from "../http-client";

export interface IBaseService {
  readonly httpClient: IHttpClient;
}

export abstract class BaseService implements IBaseService {
  public readonly httpClient: IHttpClient;

  constructor(httpClient?: IHttpClient) {
    this.httpClient = httpClient || new HttpClient();
  }

  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.httpClient.get<T>(endpoint);
  }

  protected async post<T>(
    endpoint: string,
    data: unknown = {}
  ): Promise<ApiResponse<T>> {
    return this.httpClient.post<T>(endpoint, data);
  }

  protected async put<T>(
    endpoint: string,
    data: unknown = {}
  ): Promise<ApiResponse<T>> {
    return this.httpClient.put<T>(endpoint, data);
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.httpClient.delete<T>(endpoint);
  }

  protected async request<T>(
    endpoint: string,
    config: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.httpClient.request<T>(endpoint, config);
  }
}
