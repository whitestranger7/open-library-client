import { OpenLibraryClient, BookSearchParams, ApiResponse, BookSearchResponse, WorkDetails, EditionDetails, BookDetails, ApiError } from '../src';

const basicExample = async (): Promise<void> => {
  const client = new OpenLibraryClient({
    timeout: 15000,
    headers: {
      'User-Agent': 'TypeScript-Example/1.0.0'
    }
  });

  try {
    const searchParams: BookSearchParams = {
      q: 'javascript programming',
      limit: 5
    };

    const results: ApiResponse<BookSearchResponse> = await client.searchBooks(searchParams);

    console.log(`Found ${results.data.numFound} total results`);
    console.log(`Showing first ${results.data.docs.length} books:\n`);

    results.data.docs.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`);
      
      if (book.author_name?.length) {
        console.log(`Authors: ${book.author_name.join(', ')}`);
      }
      
      if (book.first_publish_year) {
        console.log(`First published: ${book.first_publish_year}`);
      }
      
      if (book.publisher?.length) {
        console.log(`Publishers: ${book.publisher.slice(0, 2).join(', ')}`);
      }
      
      console.log(`Editions: ${book.edition_count || 'Unknown'}`);
      
      if (book.isbn?.length) {
        console.log(`ISBN: ${book.isbn[0]}`);
      }
      
      console.log('');
    });

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error:', apiError.message);
    if (apiError.status) {
      console.error(`   Status: ${apiError.status}`);
    }
  }
}

const advancedExample = async (): Promise<void> => {
  const client = new OpenLibraryClient();

  try {
    const advancedParams: BookSearchParams = {
      q: 'artificial intelligence',
      subject: 'computer science',
      limit: 3,
      lang: 'eng',
      fields: 'key,title,author_name,first_publish_year,subject,cover_i,isbn'
    };

    const results: ApiResponse<BookSearchResponse> = await client.searchBooks(advancedParams);

    console.log(`Advanced search results for AI books:`);
    console.log(`Total found: ${results.data.numFound}`);
    console.log(`Query: "${results.data.q}"`);
    console.log(`Response status: ${results.status} ${results.statusText}`);
    console.log('');

    results.data.docs.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`);
      
      if (book.author_name?.length) {
        console.log(`Authors: ${book.author_name.slice(0, 3).join(', ')}`);
      }
      
      if (book.first_publish_year) {
        console.log(`Year: ${book.first_publish_year}`);
      }
      
      if (book.subject?.length) {
        console.log(`Subjects: ${book.subject.slice(0, 3).join(', ')}`);
      }
      
      if (book.cover_i) {
        const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        console.log(`Cover: ${coverUrl}`);
      }
      
      if (book.isbn?.length) {
        console.log(`ISBN: ${book.isbn[0]}`);
      }
      
      console.log(`OpenLibrary Key: ${book.key}`);
      console.log('');
    });

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error:', apiError.message);
    if (apiError.status) {
      console.error(`HTTP Status: ${apiError.status}`);
    }
  }
}

const paginationExample = async (): Promise<void> => {
  console.log('\nPagination Example\n');

  const client = new OpenLibraryClient();

  try {
    const baseParams: BookSearchParams = {
      q: 'machine learning',
      limit: 2,
      offset: 0
    };

    console.log('Fetching first page...');
    let results = await client.searchBooks(baseParams);
    
    console.log(`Page 1: Found ${results.data.docs.length} books (of ${results.data.numFound} total)`);
    results.data.docs.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`);
    });

    console.log('\Fetching second page...');
    const nextPageParams: BookSearchParams = {
      ...baseParams,
      offset: 2
    };
    
    results = await client.searchBooks(nextPageParams);
    
    console.log(`Page 2: Found ${results.data.docs.length} books`);
    results.data.docs.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`);
    });

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Pagination Error:', apiError.message);
  }
}

const authorSearchExample = async (): Promise<void> => {
  console.log('\nAuthor-Specific Search Example\n');

  const client = new OpenLibraryClient();

  try {
    const authorParams: BookSearchParams = {
      q: '*',
      author: 'Isaac Asimov',
      limit: 4
    };

    const results = await client.searchBooks(authorParams);

    console.log(`Books by Isaac Asimov:`);
    console.log(`Found ${results.data.numFound} total books`);
    console.log('');

    results.data.docs.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`);
      
      if (book.first_publish_year) {
        console.log(`First published: ${book.first_publish_year}`);
      }
      
      if (book.subject?.length) {
        console.log(`Subjects: ${book.subject.slice(0, 2).join(', ')}`);
      }
      
      console.log('');
    });

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Author Search Error:', apiError.message);
  }
}

const configurationExample = (): void => {
  console.log('\nConfiguration Example\n');

  const defaultClient = new OpenLibraryClient();
  console.log(`Default client base URL: ${defaultClient.getBaseURL()}`);

  const customClient = new OpenLibraryClient({
    baseURL: 'https://openlibrary.org',
    timeout: 20000,
    headers: {
      'User-Agent': 'MyApp/2.0.0',
      'Accept': 'application/json'
    }
  });

  const config = customClient.getConfig();
  console.log('Custom client configuration:');
  console.log(`Base URL: ${config.baseURL}`);
  console.log(`Timeout: ${config.timeout}ms`);
  console.log(`Custom headers: ${Object.keys(config.headers).length} headers`);
}

const bookDetailsExample = async (): Promise<void> => {
  console.log('\nBook Details Examples\n');

  const client = new OpenLibraryClient();

  try {
    // First, search for a book to get its key
    console.log('1. Searching for "The Lord of the Rings" to get work key...');
    const searchResults = await client.searchBooks({
      q: 'The Lord of the Rings',
      author: 'Tolkien',
      limit: 1
    });

    if (searchResults.data.docs.length > 0) {
      const book = searchResults.data.docs[0];
      if (book) {
        console.log(`Found: ${book.title} (Key: ${book.key})`);

        // Get detailed work information
        console.log('\n2. Getting detailed work information...');
        const workDetails = await client.getWork(book.key);
      
      console.log(`Work Title: ${workDetails.data.title}`);
      
      if (workDetails.data.description) {
        const description = typeof workDetails.data.description === 'string' 
          ? workDetails.data.description 
          : workDetails.data.description.value;
        console.log(`Description: ${description.substring(0, 200)}...`);
      }
      
      if (workDetails.data.subjects?.length) {
        console.log(`Subjects: ${workDetails.data.subjects.slice(0, 3).join(', ')}`);
      }
      
      if (workDetails.data.covers?.length) {
        console.log(`Cover ID: ${workDetails.data.covers[0]}`);
      }
      
      console.log(`First Published: ${workDetails.data.first_publish_date}`);
      console.log(`Work Key: ${workDetails.data.key}`);
      }
    }

    // Example with specific edition
    console.log('\n3. Getting specific edition details...');
    try {
      const editionDetails = await client.getEdition('OL7353617M');
      
      console.log(`Edition Title: ${editionDetails.data.title}`);
      if (editionDetails.data.subtitle) {
        console.log(`Subtitle: ${editionDetails.data.subtitle}`);
      }
      
      if (editionDetails.data.publishers?.length) {
        console.log(`Publisher: ${editionDetails.data.publishers[0]}`);
      }
      
      console.log(`Publish Date: ${editionDetails.data.publish_date}`);
      
      if (editionDetails.data.number_of_pages) {
        console.log(`Pages: ${editionDetails.data.number_of_pages}`);
      }
      
      if (editionDetails.data.isbn_13?.length) {
        console.log(`ISBN-13: ${editionDetails.data.isbn_13[0]}`);
      }
      
      if (editionDetails.data.physical_format) {
        console.log(`Format: ${editionDetails.data.physical_format}`);
      }
      
      console.log(`Edition Key: ${editionDetails.data.key}`);
    } catch (error) {
      console.log('Edition not found or error occurred');
    }

    // Example with ISBN lookup
    console.log('\n4. Getting book by ISBN...');
    try {
      const bookByISBN = await client.getBookByISBN('9780547928227');
      
      console.log(`Book Title: ${bookByISBN.data.title}`);
      
      if (bookByISBN.data.publishers?.length) {
        console.log(`Publisher: ${bookByISBN.data.publishers[0]}`);
      }
      
      console.log(`Publish Date: ${bookByISBN.data.publish_date}`);
      
      if (bookByISBN.data.number_of_pages) {
        console.log(`Pages: ${bookByISBN.data.number_of_pages}`);
      }
      
      if (bookByISBN.data.isbn_13?.length) {
        console.log(`ISBN-13: ${bookByISBN.data.isbn_13[0]}`);
      }
      
      console.log(`Book Key: ${bookByISBN.data.key}`);
    } catch (error) {
      console.log('Book not found by ISBN or error occurred');
    }

  } catch (error) {
    const apiError = error as ApiError;
    console.error('Book Details Error:', apiError.message);
    if (apiError.status) {
      console.error(`HTTP Status: ${apiError.status}`);
    }
  }
};

const runExamples = async (): Promise<void> => {
  console.log('OpenLibrary Client TypeScript Examples\n');
  console.log('==========================================');

  await basicExample();
  await advancedExample();
  await paginationExample();
  await authorSearchExample();
  await bookDetailsExample();
  configurationExample();

  console.log('\nAll examples completed!');
};

if (require.main === module) {
  runExamples().catch(console.error);
}

export { runExamples }; 