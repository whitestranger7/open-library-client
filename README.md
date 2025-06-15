# OpenLibrary Client

A modern TypeScript API wrapper for the [OpenLibrary REST API](https://openlibrary.org/developers/api), designed to provide a clean and type-safe interface for JavaScript and TypeScript developers.

## Features

- 🚀 **Modern TypeScript**: Full type safety with comprehensive interfaces and IntelliSense support
- 📦 **Minimal Dependencies**: Built with only axios for HTTP requests
- 🛡️ **Error Handling**: Robust error handling with detailed typed error responses
- 🔧 **Configurable**: Flexible configuration options with type validation
- 📚 **Well Documented**: Comprehensive documentation and TypeScript examples
- 🎯 **Focused**: Clean API surface focused on essential functionality
- 💡 **Developer Experience**: Auto-completion, type checking, and inline documentation

## Installation

```bash
npm install open-library-client
```

```bash
yarn add open-library-client
```

```bash
pnpm add open-library-client
```

## Quick Start

```typescript
import { OpenLibraryClient, BookSearchParams, ApiResponse, BookSearchResponse } from 'open-library-client';

// Create a client instance with configuration
const client = new OpenLibraryClient({
  timeout: 15000,
  headers: {
    'User-Agent': 'MyApp/1.0.0'
  }
});

// Search for books with full type safety
const searchParams: BookSearchParams = {
  q: 'The Lord of the Rings',
  author: 'Tolkien',
  limit: 5
};

const results: ApiResponse<BookSearchResponse> = await client.searchBooks(searchParams);

console.log(`Found ${results.data.numFound} books`);
results.data.docs.forEach(book => {
  console.log(`${book.title} by ${book.author_name?.join(', ')}`);
});
```

## Running the Examples

To see the library in action with comprehensive TypeScript examples:

```bash
# Install dependencies
npm install

# Run the TypeScript example (recommended)
npm run example

# Or build first and run the compiled JavaScript
npm run example:js
```

## API Reference

### OpenLibraryClient

The main client class for interacting with the OpenLibrary API.

#### Constructor

```typescript
new OpenLibraryClient(config?: OpenLibraryClientConfig)
```

**Parameters:**
- `config` (optional): Configuration options for the client

#### Configuration Options

```typescript
interface OpenLibraryClientConfig {
  baseURL?: string;        // Default: 'https://openlibrary.org'
  timeout?: number;        // Default: 10000 (10 seconds)
  headers?: Record<string, string>; // Custom headers
}
```

#### Methods

##### searchBooks(params: BookSearchParams)

Search for books using the OpenLibrary search API.

**Parameters:**
```typescript
interface BookSearchParams {
  q: string;              // Main search query (required)
  title?: string;         // Search by title
  author?: string;        // Search by author
  isbn?: string;          // Search by ISBN
  subject?: string;       // Search by subject
  limit?: number;         // Number of results (default: 10, max: 100)
  offset?: number;        // Pagination offset (default: 0)
  fields?: string;        // Specific fields to include
  lang?: string;          // Language preference
}
```

**Returns:**
```typescript
Promise<ApiResponse<BookSearchResponse>>
```

**Example:**
```typescript
// Basic search with type safety
const basicParams: BookSearchParams = {
  q: 'javascript programming'
};
const results = await client.searchBooks(basicParams);

// Advanced search with multiple parameters
const advancedParams: BookSearchParams = {
  q: 'programming',
  subject: 'javascript',
  limit: 20,
  offset: 0,
  lang: 'en',
  fields: 'key,title,author_name,first_publish_year,isbn'
};
const results = await client.searchBooks(advancedParams);

// Search by specific criteria
const authorParams: BookSearchParams = {
  q: '*',
  author: 'Douglas Crockford',
  title: 'JavaScript'
};
const results = await client.searchBooks(authorParams);
```

### Response Types

#### BookSearchResponse

```typescript
interface BookSearchResponse {
  numFound: number;           // Total number of results found
  start: number;              // Starting position
  numFoundExact: boolean;     // Whether count is exact
  docs: BookSearchResult[];   // Array of book results
  num_found: number;          // Alternative count field
  q: string;                  // Original query
  offset: number | null;      // Current offset
}
```

#### BookSearchResult

Each book result contains detailed information:

```typescript
interface BookSearchResult {
  key: string;                    // OpenLibrary work key
  title: string;                  // Book title
  author_name?: string[];         // Author names
  author_key?: string[];          // Author keys
  first_publish_year?: number;    // First publication year
  publish_year?: number[];        // All publication years
  isbn?: string[];                // ISBN numbers
  publisher?: string[];           // Publishers
  subject?: string[];             // Subjects/topics
  cover_i?: number;               // Cover image ID
  edition_count: number;          // Number of editions
  has_fulltext: boolean;          // Full text available
  // ... and many more fields
}
```

### Error Handling

The client provides structured error handling with TypeScript support:

```typescript
import { ApiError } from 'open-library-client';

try {
  const searchParams: BookSearchParams = { q: 'test' };
  const results = await client.searchBooks(searchParams);
} catch (error) {
  const apiError = error as ApiError;
  if (apiError.status) {
    console.error(`API Error ${apiError.status}: ${apiError.message}`);
  } else {
    console.error(`Network Error: ${apiError.message}`);
  }
}
```

## Advanced Usage

### Custom Configuration

```typescript
const client = new OpenLibraryClient({
  timeout: 15000,
  headers: {
    'User-Agent': 'MyApp/1.0.0'
  }
});
```

### Working with Results

```typescript
const searchParams: BookSearchParams = {
  q: 'artificial intelligence',
  limit: 10
};

const results: ApiResponse<BookSearchResponse> = await client.searchBooks(searchParams);

// Access metadata with full type safety
console.log(`Total results: ${results.data.numFound}`);
console.log(`Showing: ${results.data.docs.length} books`);
console.log(`Response status: ${results.status} ${results.statusText}`);

// Process each book with TypeScript autocompletion
results.data.docs.forEach((book, index) => {
  console.log(`${index + 1}. ${book.title}`);
  
  if (book.author_name?.length) {
    console.log(`   Authors: ${book.author_name.join(', ')}`);
  }
  
  if (book.first_publish_year) {
    console.log(`   First published: ${book.first_publish_year}`);
  }
  
  if (book.cover_i) {
    const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    console.log(`   Cover: ${coverUrl}`);
  }
  
  if (book.isbn?.length) {
    console.log(`   ISBN: ${book.isbn[0]}`);
  }
});
```

### Pagination

```typescript
// Get first page with typed parameters
const baseParams: BookSearchParams = {
  q: 'science fiction',
  limit: 10,
  offset: 0
};

let results: ApiResponse<BookSearchResponse> = await client.searchBooks(baseParams);
console.log(`Page 1: ${results.data.docs.length} results`);

// Get second page using spread operator for type safety
const nextPageParams: BookSearchParams = {
  ...baseParams,
  offset: 10
};

results = await client.searchBooks(nextPageParams);
console.log(`Page 2: ${results.data.docs.length} results`);
```

## Development Roadmap

This is the initial version focusing on book search functionality. Future versions will include:

- **Work Details**: Get detailed information about specific works
- **Author Information**: Retrieve author details and bibliographies  
- **Edition Data**: Access specific edition information
- **Subject Browsing**: Browse books by subject categories
- **Reading Lists**: Integration with OpenLibrary reading lists
- **Rate Limiting**: Built-in rate limiting for API compliance
- **Caching**: Optional response caching for better performance
- **Batch Operations**: Support for batch requests

## Contributing

This is an open-source project and contributions are welcome! Please see our contributing guidelines for more information.

## License

MIT License - see LICENSE file for details.

## Links

- [OpenLibrary API Documentation](https://openlibrary.org/developers/api)
- [OpenLibrary Website](https://openlibrary.org/)
- [Issue Tracker](https://github.com/username/open-library-client/issues)

---

Built with ❤️ for the JavaScript and TypeScript community.