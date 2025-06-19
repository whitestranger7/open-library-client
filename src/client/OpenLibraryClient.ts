import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  OpenLibraryClientConfig,
  BookSearchParams,
  BookSearchResponse,
  WorkDetails,
  EditionDetails,
  BookDetails,
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
   * Get detailed information about a specific work
   * @param workKey - The OpenLibrary work key (e.g., "OL45804W")
   * @returns Promise resolving to work details
   * 
   * @example
   * ```typescript
   * const client = new OpenLibraryClient();
   * const work = await client.getWork("OL45804W");
   * console.log(work.data.title);
   * ```
   */
  async getWork(workKey: string): Promise<ApiResponse<WorkDetails>> {
    try {
      // Remove '/works/' prefix if provided and ensure it starts with 'OL'
      const cleanKey = workKey.replace('/works/', '').replace(/^\//, '');
      
      if (!cleanKey.startsWith('OL')) {
        throw new Error('Work key must start with "OL" (e.g., "OL45804W")');
      }

      const response = await this.httpClient.get<WorkDetails>(
        `/works/${cleanKey}.json`
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
   * Get detailed information about a specific edition
   * @param editionKey - The OpenLibrary edition key (e.g., "OL7353617M")
   * @returns Promise resolving to edition details
   * 
   * @example
   * ```typescript
   * const client = new OpenLibraryClient();
   * const edition = await client.getEdition("OL7353617M");
   * console.log(edition.data.title);
   * ```
   */
  async getEdition(editionKey: string): Promise<ApiResponse<EditionDetails>> {
    try {
      // Remove '/books/' prefix if provided and ensure it starts with 'OL'
      const cleanKey = editionKey.replace('/books/', '').replace(/^\//, '');
      
      if (!cleanKey.startsWith('OL')) {
        throw new Error('Edition key must start with "OL" (e.g., "OL7353617M")');
      }

      const response = await this.httpClient.get<EditionDetails>(
        `/books/${cleanKey}.json`
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
   * Get book information by ISBN
   * @param isbn - The ISBN (10 or 13 digits)
   * @returns Promise resolving to book details
   * 
   * @example
   * ```typescript
   * const client = new OpenLibraryClient();
   * const book = await client.getBookByISBN("9780140328721");
   * console.log(book.data.title);
   * ```
   */
  async getBookByISBN(isbn: string): Promise<ApiResponse<BookDetails>> {
    try {
      // Clean the ISBN (remove spaces, hyphens)
      const cleanISBN = isbn.replace(/[-\s]/g, '');
      
      // Validate ISBN format (basic check)
      if (!/^\d{10}$/.test(cleanISBN) && !/^\d{13}$/.test(cleanISBN)) {
        throw new Error('ISBN must be 10 or 13 digits');
      }

      const response = await this.httpClient.get<BookDetails>(
        `/isbn/${cleanISBN}.json`
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
   * Generate cover image URL from cover ID
   * @param coverId - The cover ID number
   * @param size - Size of the cover image ('S', 'M', or 'L')
   * @returns Cover image URL
   * 
   * @example
   * ```typescript
   * const client = new OpenLibraryClient();
   * const coverUrl = client.getCoverUrl(8739161, 'M');
   * console.log(coverUrl); // https://covers.openlibrary.org/b/id/8739161-M.jpg
   * ```
   */
  getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }

  /**
   * Generate cover image URL from ISBN
   * @param isbn - The ISBN (10 or 13 digits)
   * @param size - Size of the cover image ('S', 'M', or 'L')
   * @returns Cover image URL
   * 
   * @example
   * ```typescript
   * const client = new OpenLibraryClient();
   * const coverUrl = client.getCoverUrlByISBN('9780547928227', 'L');
   * console.log(coverUrl); // https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg
   * ```
   */
  getCoverUrlByISBN(isbn: string, size: 'S' | 'M' | 'L' = 'M'): string {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    return `https://covers.openlibrary.org/b/isbn/${cleanISBN}-${size}.jpg`;
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