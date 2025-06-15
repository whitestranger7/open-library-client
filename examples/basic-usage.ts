import { OpenLibraryClient, BookSearchParams, ApiResponse, BookSearchResponse, ApiError } from '../src';

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
    console.error('❌ Error:', apiError.message);
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

const runExamples = async (): Promise<void> => {
  try {
    await basicExample();
    await advancedExample();
    await paginationExample();
    await authorSearchExample();
    configurationExample();
    
    console.log('For more information, check the README.md file');
  } catch (error) {
    console.error('Unexpected error in examples:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runExamples().catch(console.error);
}

export { runExamples }; 