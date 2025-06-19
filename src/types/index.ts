/**
 * Base configuration for the OpenLibrary client
 */
export interface OpenLibraryClientConfig {
  /**
   * Base URL for the OpenLibrary API
   * @default 'https://openlibrary.org'
   */
  baseURL?: string;
  
  /**
   * Request timeout in milliseconds
   * @default 10000
   */
  timeout?: number;
  
  /**
   * Custom headers to include with requests
   */
  headers?: Record<string, string>;
}

/**
 * Year range for filtering books
 */
export interface YearRange {
  start: number;
  end: number;
}

/**
 * Sort options for search results
 */
export type SortOption = 'random' | 'new' | 'old' | 'rating' | 'title' | 'relevance';

/**
 * Search parameters for book search
 */
export interface BookSearchParams {
  /**
   * The query string to search for
   */
  q: string;
  
  /**
   * Search by title
   */
  title?: string;
  
  /**
   * Search by author
   */
  author?: string;
  
  /**
   * Search by ISBN
   */
  isbn?: string;
  
  /**
   * Search by subject/genre
   */
  subject?: string;
  
  /**
   * Filter by first publish year (single year or range)
   * @example 1990 or { start: 1990, end: 2000 }
   */
  first_publish_year?: number | YearRange;
  
  /**
   * Filter by any publish year (single year or range)
   * @example 2000 or { start: 2000, end: 2010 }
   */
  publish_year?: number | YearRange;
  
  /**
   * Sort results by various criteria
   * @default 'relevance'
   */
  sort?: SortOption;
  
  /**
   * Number of results to return (max 100)
   * @default 10
   */
  limit?: number;
  
  /**
   * Offset for pagination
   * @default 0
   */
  offset?: number;
  
  /**
   * Fields to include in response
   */
  fields?: string;
  
  /**
   * Language preference (ISO 639-1 code)
   * @example 'en', 'fr', 'es'
   */
  lang?: string;
}

/**
 * Author information
 */
export interface Author {
  key: string;
  name: string;
}

/**
 * Publisher information
 */
export interface Publisher {
  name: string;
}

/**
 * Individual book/work from search results
 */
export interface BookSearchResult {
  key: string;
  type: string;
  seed: string[];
  title: string;
  title_suggest: string;
  title_sort: string;
  edition_count: number;
  edition_key: string[];
  publish_date: string[];
  publish_year: number[];
  first_publish_year: number;
  number_of_pages_median: number;
  lccn: string[];
  publish_place: string[];
  oclc: string[];
  contributor: string[];
  lcc: string[];
  ddc: string[];
  isbn: string[];
  last_modified_i: number;
  ebook_count_i: number;
  ebook_access: string;
  has_fulltext: boolean;
  public_scan_b: boolean;
  ia: string[];
  ia_collection: string[];
  ia_collection_s: string;
  lending_edition_s: string;
  lending_identifier_s: string;
  printdisabled_s: string;
  ratings_average: number;
  ratings_sortable: number;
  ratings_count: number;
  ratings_count_1: number;
  ratings_count_2: number;
  ratings_count_3: number;
  ratings_count_4: number;
  ratings_count_5: number;
  readinglog_count: number;
  want_to_read_count: number;
  currently_reading_count: number;
  already_read_count: number;
  cover_edition_key: string;
  cover_i: number;
  publisher: string[];
  language: string[];
  author_key: string[];
  author_name: string[];
  author_alternative_name: string[];
  person: string[];
  place: string[];
  subject: string[];
  time: string[];
  id_amazon: string[];
  id_librarything: string[];
  id_goodreads: string[];
  id_google: string[];
  id_project_gutenberg: string[];
  id_standard_ebooks: string[];
}

/**
 * Response from book search API
 */
export interface BookSearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: BookSearchResult[];
  num_found: number;
  q: string;
  offset: number | null;
}

/**
 * API Error response
 */
export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * Detailed work information from OpenLibrary
 */
export interface WorkDetails {
  key: string;
  type: {
    key: string;
  };
  title: string;
  description?: string | {
    type: string;
    value: string;
  };
  authors?: Array<{
    type: {
      key: string;
    };
    author: {
      key: string;
    };
  }>;
  subjects?: string[];
  subject_places?: string[];
  subject_times?: string[];
  subject_people?: string[];
  covers?: number[];
  first_publish_date?: string;
  links?: Array<{
    url: string;
    title: string;
    type?: {
      key: string;
    };
  }>;
  excerpts?: Array<{
    excerpt: string;
    comment?: string;
  }>;
  created: {
    type: string;
    value: string;
  };
  last_modified: {
    type: string;
    value: string;
  };
  latest_revision: number;
  revision: number;
}

/**
 * Detailed edition information from OpenLibrary
 */
export interface EditionDetails {
  key: string;
  type: {
    key: string;
  };
  title: string;
  subtitle?: string;
  authors?: Array<{
    key: string;
  }>;
  works?: Array<{
    key: string;
  }>;
  isbn_10?: string[];
  isbn_13?: string[];
  publishers?: string[];
  publish_date?: string;
  publish_places?: string[];
  publish_country?: string;
  number_of_pages?: number;
  pagination?: string;
  physical_format?: string;
  languages?: Array<{
    key: string;
  }>;
  subjects?: string[];
  covers?: number[];
  series?: string[];
  genres?: string[];
  description?: string | {
    type: string;
    value: string;
  };
  notes?: string | {
    type: string;
    value: string;
  };
  table_of_contents?: Array<{
    title: string;
    level?: number;
    pagenum?: string;
  }>;
  dewey_decimal_class?: string[];
  lc_classifications?: string[];
  lccn?: string[];
  oclc_numbers?: string[];
  goodreads?: string[];
  librarything?: string[];
  created: {
    type: string;
    value: string;
  };
  last_modified: {
    type: string;
    value: string;
  };
  latest_revision: number;
  revision: number;
}

/**
 * Book details response (can be either work or edition)
 */
export interface BookDetails {
  key: string;
  type: {
    key: string;
  };
  title: string;
  subtitle?: string;
  description?: string | {
    type: string;
    value: string;
  };
  authors?: Array<{
    key: string;
    name?: string;
  }>;
  publishers?: string[];
  publish_date?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  number_of_pages?: number;
  covers?: number[];
  subjects?: string[];
  physical_format?: string;
  works?: Array<{
    key: string;
  }>;
  created: {
    type: string;
    value: string;
  };
  last_modified: {
    type: string;
    value: string;
  };
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
} 