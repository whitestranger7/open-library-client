# Changelog

All notable changes to this project will be documented in this file.

## [0.1.2] - 2024-12-30

### Technical
- Dependencies version bump

### Improved
- README.md file is updated

## [0.1.1] - 2024-12-30

### Added

**Random Book Search & Advanced Filtering**
- `sort` parameter in `BookSearchParams` - Sort results by 'random', 'new', 'old', 'rating', 'title', or 'relevance'
- `first_publish_year` parameter - Filter by first publication year or year range
- `publish_year` parameter - Filter by any publication year or year range
- `YearRange` interface - Define year ranges with start and end properties
- `SortOption` type - Type-safe sorting options

**Enhanced Language Support**
- Improved `lang` parameter documentation with examples for language filtering

**Random Book Examples**
- Complete examples showing random book selection by genre, year range, and language
- Demonstrates real-world usage for external applications needing random book discovery

### Improved
- Enhanced TypeScript type coverage for search parameters
- Better documentation for year filtering and sorting options
- Updated examples with comprehensive random book search workflows

### Technical
- Year range filtering implemented using OpenLibrary's query syntax (e.g., `first_publish_year:[1980 TO 1989]`)
- Random sorting leverages OpenLibrary's native `sort=random` parameter
- Maintained full backward compatibility with existing search functionality

## [0.1.0] - 2024-12-30

### Added

**Book Details API**
- `getWork(workKey)` - Retrieve detailed information about a specific work
- `getEdition(editionKey)` - Get comprehensive edition details including ISBN, publishers, and physical format
- `getBookByISBN(isbn)` - Look up books directly by ISBN-10 or ISBN-13

**Cover Image Utilities**
- `getCoverUrl(coverId, size)` - Generate cover image URLs from cover IDs with size options (S/M/L)
- `getCoverUrlByISBN(isbn, size)` - Generate cover image URLs directly from ISBN

**New TypeScript Types**
- `WorkDetails` - Complete work information including description, subjects, and metadata
- `EditionDetails` - Detailed edition data with publication info, page counts, and classifications
- `BookDetails` - Book information structure for ISBN lookups

**Better Example**
- Real-world usage patterns for work, edition, and ISBN lookups
- Cover image URL generation example

### Improved
- Updated documentation with complete API reference for new methods
- Enhanced TypeScript type coverage for better developer experience
- Input validation for ISBN format and OpenLibrary key formats

### Technical
- Complete JSDoc documentation with examples for all new features
- Examples folder removed from dist/ and available only in repo

## [0.0.1] - Initial Release

### Added
- Basic book search functionality with `searchBooks()` method
- TypeScript support with comprehensive type definitions
- Configurable HTTP client with timeout and custom headers
- Error handling with structured error responses
- Pagination support for search results 