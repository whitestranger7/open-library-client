import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  OpenLibraryClientConfig,
  BookSearchParams,
  BookSearchResponse,
  ApiResponse,
  ApiError,
} from '../types';

/**
 * Main client for interacting with the OpenLibrary API
 */
export class OpenLibraryClient {
  private readonly httpClient: AxiosInstance;
  private readonly config: Required<OpenLibraryClientConfig>;

  /**
   * Create a new OpenLibrary client instance
   * @param config - Configuration options for the client
   */
  constructor(config: OpenLibraryClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || 'https://openlibrary.org',
      timeout: config.timeout || 10000,
      headers: config.headers || {},
    };

    this.httpClient = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'open-library-client/1.0.0',
        ...this.config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    this.httpClient.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    this.httpClient.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        error: error.response.data?.error || 'API Error',
        message: error.response.data?.message || error.message,
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        error: 'Network Error',
        message: 'No response received from server',
      };
    } else {
      return {
        error: 'Request Error',
        message: error.message,
      };
    }
  }

  /**
   * Search for books using the OpenLibrary search API
   * @param params - Search parameters
   * @returns Promise resolving to search results
   * 
   * @example
   * ```typescript
   * const client = new OpenLibraryClient();
   * const results = await client.searchBooks({
   *   q: 'The Lord of the Rings',
   *   author: 'Tolkien',
   *   limit: 5
   * });
   * ```
   */
  async searchBooks(params: BookSearchParams): Promise<ApiResponse<BookSearchResponse>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', params.q);
      
      if (params.title) queryParams.append('title', params.title);
      if (params.author) queryParams.append('author', params.author);
      if (params.isbn) queryParams.append('isbn', params.isbn);
      if (params.subject) queryParams.append('subject', params.subject);
      if (params.lang) queryParams.append('lang', params.lang);
      if (params.fields) queryParams.append('fields', params.fields);
      
      queryParams.append('limit', String(params.limit || 10));
      queryParams.append('offset', String(params.offset || 0));
      
      queryParams.append('format', 'json');

      const response = await this.httpClient.get<BookSearchResponse>(
        `/search.json?${queryParams.toString()}`
      );

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the current client configuration
   */
  getConfig(): Required<OpenLibraryClientConfig> {
    return { ...this.config };
  }

  /**
   * Get the base URL being used by the client
   */
  getBaseURL(): string {
    return this.config.baseURL;
  }
} 