# Changelog

All notable changes to this project will be documented in this file.

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