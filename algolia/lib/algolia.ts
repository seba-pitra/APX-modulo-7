import algoliasearch from 'algoliasearch';

// For the search only version
// import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('7SE2IEVF8O', 'bf61b81b6cdb27fdfa5b7852e1a8c150');
export const index = client.initIndex('products');

