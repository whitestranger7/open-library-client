import { OpenLibraryClient, BookSearchParams, YearRange, SortOption, ApiResponse, BookSearchResponse, WorkDetails, EditionDetails, BookDetails, ApiError } from '../src';

const comprehensiveExample = async (): Promise<void> => {
  console.log('OpenLibrary Client - Complete Workflow Example');
  console.log('==============================================\n');

  const client = new OpenLibraryClient({
    timeout: 15000,
    headers: {
      'User-Agent': 'OpenLibrary-Example/1.0.0'
    }
  });

  try {
    // Search for books
    console.log('Searching for "The Hobbit" by J.R.R. Tolkien...');
    const searchParams: BookSearchParams = {
      q: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      limit: 3
    };

    const searchResults: ApiResponse<BookSearchResponse> = await client.searchBooks(searchParams);
    console.log(`Found ${searchResults.data.numFound} total results`);
    console.log(`First of ${searchResults.data.docs.length} books:\n`);

    // Display search results
    searchResults.data.docs.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`);
      console.log(`Key: ${book.key}`);
      console.log(`First Published: ${book.first_publish_year || 'Unknown'}`);
      console.log(`Editions: ${book.edition_count}`);
      if (book.cover_i) {
        console.log(`   Cover ID: ${book.cover_i}`);
      }
      console.log('');
    });

    // Get the ID of the first book
    if (searchResults.data.docs.length > 0) {
      const selectedBook = searchResults.data.docs[0];
      if (!selectedBook) {
        console.log('No valid book found in search results.');
        return;
      }
      
      console.log(`Selected book - "${selectedBook.title}"`);
      console.log(`Work Key: ${selectedBook.key}\n`);

      // Get detailed information about the specific book
      console.log('Getting detailed work information...');
      const workDetails: ApiResponse<WorkDetails> = await client.getWork(selectedBook.key);
      
      console.log(`Title: ${workDetails.data.title}`);
      
      if (workDetails.data.description) {
        const description = typeof workDetails.data.description === 'string' 
          ? workDetails.data.description 
          : workDetails.data.description.value;
        console.log(`Description: ${description.substring(0, 200)}...`);
      }
      
      if (workDetails.data.subjects && workDetails.data.subjects.length > 0) {
        console.log(`Subjects: ${workDetails.data.subjects.slice(0, 3).join(', ')}`);
      }
      
      console.log(`First Published: ${workDetails.data.first_publish_date || 'Unknown'}`);
      
      if (workDetails.data.covers && workDetails.data.covers.length > 0) {
        console.log(`Cover IDs: ${workDetails.data.covers.slice(0, 3).join(', ')}`);
      }
      console.log('');

      // Get cover URLs
      console.log('Generating cover image URLs...');
      
      // Using cover ID from work details
      if (workDetails.data.covers && workDetails.data.covers.length > 0) {
        const coverId = workDetails.data.covers[0];
        if (coverId) {
          const smallCover = client.getCoverUrl(coverId, 'S');
          const mediumCover = client.getCoverUrl(coverId, 'M');
          const largeCover = client.getCoverUrl(coverId, 'L');
        
          console.log('Cover URLs by Cover ID:');
          console.log(`Small:  ${smallCover}`);
          console.log(`Medium: ${mediumCover}`);
          console.log(`Large:  ${largeCover}`);
        }
      }

      // Using cover ID from search results
      if (selectedBook.cover_i) {
        const searchCoverUrl = client.getCoverUrl(selectedBook.cover_i, 'M');
        console.log(`Cover from search: ${searchCoverUrl}`);
      }

      // Get cover by ISBN if available
      if (selectedBook.isbn && selectedBook.isbn.length > 0) {
        const isbn = selectedBook.isbn[0];
        if (isbn) {
          const coverByISBN = client.getCoverUrlByISBN(isbn, 'M');
          console.log(`Cover by ISBN: ${coverByISBN}`);
        
          // Get book details by ISBN
          console.log('\nGetting book details by ISBN...');
          try {
            const bookByISBN: ApiResponse<BookDetails> = await client.getBookByISBN(isbn);
            console.log(`Book Title: ${bookByISBN.data.title}`);
            console.log(`ISBN-13: ${bookByISBN.data.isbn_13?.[0] || 'Not available'}`);
            console.log(`Pages: ${bookByISBN.data.number_of_pages || 'Not available'}`);
            console.log(`Publisher: ${bookByISBN.data.publishers?.[0] || 'Not available'}`);
            console.log(`Physical Format: ${bookByISBN.data.physical_format || 'Not available'}`);
          } catch (error) {
            console.log('ISBN lookup not available for this book');
          }
        }
      }

      console.log('\n' + '='.repeat(50));
      console.log('Workflow Complete!');
      console.log('='.repeat(50));
      
    } else {
      console.log('No books found in search results.');
    }

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error in workflow:', apiError.message);
    if (apiError.status) {
      console.error(`HTTP Status: ${apiError.status}`);
    }
  }
};

const randomBookExample = async (): Promise<void> => {
  console.log('Random Book Search Examples');
  console.log('===========================\n');

  const client = new OpenLibraryClient();

  try {
    // Random sci-fi book from 1980s
    console.log('1. Random science fiction book from the 1980s...');
    const sciFiParams: BookSearchParams = {
      q: '*',  // Search everything
      subject: 'science fiction',
      first_publish_year: { start: 1980, end: 1989 },
      sort: 'random',
      limit: 1
    };

    const sciFiResult = await client.searchBooks(sciFiParams);
    if (sciFiResult.data.docs.length > 0) {
      const book = sciFiResult.data.docs[0];
      if (book) {
        console.log(`Found: "${book.title}"`);
        console.log(`Year: ${book.first_publish_year}`);
        console.log(`Authors: ${book.author_name?.join(', ') || 'Unknown'}`);
        console.log(`Key: ${book.key}\n`);
      }
    }

    // Random French book from any year
    console.log('2. Random book in French...');
    const frenchParams: BookSearchParams = {
      q: '*',
      lang: 'fr',
      sort: 'random',
      limit: 1
    };

    const frenchResult = await client.searchBooks(frenchParams);
    if (frenchResult.data.docs.length > 0) {
      const book = frenchResult.data.docs[0];
      if (book) {
        console.log(`Found: "${book.title}"`);
        console.log(`Year: ${book.first_publish_year || 'Unknown'}`);
        console.log(`Authors: ${book.author_name?.join(', ') || 'Unknown'}`);
        console.log(`Key: ${book.key}\n`);
      }
    }

    // Random fantasy (2000-2020)
    console.log('3. Random fantasy book (2000-2020)...');
    const fantasyParams: BookSearchParams = {
      q: '*',
      subject: 'fantasy',
      first_publish_year: { start: 2000, end: 2020 },
      lang: 'en',
      sort: 'random',
      limit: 3
    };

    const fantasyResult = await client.searchBooks(fantasyParams);
    console.log(`Found ${fantasyResult.data.docs.length} random fantasy books:`);
    fantasyResult.data.docs.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" (${book.first_publish_year})`);
      console.log(`Authors: ${book.author_name?.join(', ') || 'Unknown'}`);
      console.log(`Key: ${book.key}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('Random Search Examples Complete!');
    console.log('='.repeat(50));

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Random search error:', apiError.message);
    if (apiError.status) {
      console.error(`HTTP Status: ${apiError.status}`);
    }
  }
};

const runExample = async (): Promise<void> => {
  try {
    await comprehensiveExample();
    await randomBookExample();
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runExample();
}

export { runExample }; 