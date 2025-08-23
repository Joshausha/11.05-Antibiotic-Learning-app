/**
 * PubMed API Service
 * Integrates with NCBI's E-utilities API for medical literature access
 * Supports evidence-based content updates and research validation
 */

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const API_KEY = process.env.REACT_APP_PUBMED_API_KEY; // Optional but recommended
const DEFAULT_RETMAX = 20; // Default number of results to return

/**
 * Search PubMed for articles related to specific topics
 * @param {string} query - Search query (e.g., "antibiotic resistance pediatric")
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results with article metadata
 */
export const searchPubMed = async (query, options = {}) => {
  const {
    maxResults = DEFAULT_RETMAX,
    dateRange = '5', // Years back to search
    sortBy = 'relevance', // relevance, date, title
    filters = [] // Additional filters
  } = options;

  try {
    // Step 1: Search for article IDs
    const searchParams = new URLSearchParams({
      db: 'pubmed',
      term: query,
      retmax: maxResults.toString(),
      datetype: 'pdat',
      reldate: dateRange,
      sort: sortBy,
      usehistory: 'y'
    });

    if (API_KEY) {
      searchParams.append('api_key', API_KEY);
    }

    // Add filters for medical relevance
    const medicalFilters = [
      'hasabstract', // Must have abstract
      'English[lang]', // English language only
      ...filters
    ];
    
    if (medicalFilters.length > 0) {
      searchParams.set('term', `${query} AND (${medicalFilters.join(' AND ')})`);
    }

    const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi?${searchParams}`;
    
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`PubMed search failed: ${searchResponse.status}`);
    }

    // Safely handle response text method for testing
    let searchData;
    if (typeof searchResponse.text === 'function') {
      searchData = await searchResponse.text();
    } else {
      // Fallback for mock responses in tests
      searchData = searchResponse.data || searchResponse.body || '';
    }
    const articleIds = extractArticleIds(searchData);

    if (articleIds.length === 0) {
      return {
        query,
        totalResults: 0,
        articles: [],
        searchTime: new Date().toISOString()
      };
    }

    // Step 2: Fetch detailed article information
    const articles = await fetchArticleDetails(articleIds);

    return {
      query,
      totalResults: articleIds.length,
      articles,
      searchTime: new Date().toISOString()
    };

  } catch (error) {
    console.error('PubMed API error:', error);
    throw new Error(`Failed to search PubMed: ${error.message}`);
  }
};

/**
 * Get articles related to specific antibiotic topics
 * @param {string} antibiotic - Antibiotic name
 * @param {string} indication - Medical indication (optional)
 * @returns {Promise<Object>} Relevant articles
 */
export const getAntibioticGuidelines = async (antibiotic, indication = '') => {
  const baseQuery = `"${antibiotic}" AND (guidelines OR therapy OR treatment)`;
  const fullQuery = indication 
    ? `${baseQuery} AND "${indication}"`
    : baseQuery;

  return searchPubMed(fullQuery, {
    maxResults: 10,
    dateRange: '3', // Last 3 years for current guidelines
    sortBy: 'relevance',
    filters: ['systematic review', 'clinical trial', 'guideline']
  });
};

/**
 * Get resistance pattern research for specific pathogens
 * @param {string} pathogen - Pathogen name
 * @param {string} region - Geographic region (optional)
 * @returns {Promise<Object>} Resistance pattern articles
 */
export const getResistancePatterns = async (pathogen, region = '') => {
  const baseQuery = `"${pathogen}" AND (resistance OR susceptibility OR antimicrobial)`;
  const fullQuery = region 
    ? `${baseQuery} AND "${region}"`
    : baseQuery;

  return searchPubMed(fullQuery, {
    maxResults: 15,
    dateRange: '2', // Last 2 years for current resistance data
    sortBy: 'date',
    filters: ['surveillance', 'epidemiology']
  });
};

/**
 * Get pediatric-specific antibiotic information
 * @param {string} condition - Medical condition
 * @param {string} antibiotic - Antibiotic name (optional)
 * @returns {Promise<Object>} Pediatric treatment articles
 */
export const getPediatricGuidelines = async (condition, antibiotic = '') => {
  const baseQuery = `"${condition}" AND (pediatric OR children OR infant)`;
  const fullQuery = antibiotic 
    ? `${baseQuery} AND "${antibiotic}"`
    : baseQuery;

  return searchPubMed(fullQuery, {
    maxResults: 12,
    dateRange: '5', // Last 5 years for pediatric guidelines
    sortBy: 'relevance',
    filters: ['clinical trial', 'guideline', 'systematic review']
  });
};

/**
 * Extract article IDs from PubMed search XML response
 * @param {string} xmlData - XML response from esearch
 * @returns {Array<string>} Array of PubMed IDs
 */
const extractArticleIds = (xmlData) => {
  try {
    // Handle missing DOMParser in test environments
    if (typeof DOMParser === 'undefined') {
      console.warn('DOMParser not available, using fallback XML parsing');
      // Simple regex fallback for test environments
      const idMatches = xmlData.match(/<Id>(\d+)<\/Id>/g) || [];
      return idMatches.map(match => match.replace(/<\/?Id>/g, ''));
    }

    const parser = new DOMParser();
    
    // Handle malformed XML responses
    if (!xmlData || typeof xmlData !== 'string' || xmlData.trim() === '') {
      console.warn('Empty or invalid XML data provided');
      return [];
    }

    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
    
    // Check for XML parsing errors
    const parseErrors = xmlDoc.getElementsByTagName('parsererror');
    if (parseErrors.length > 0) {
      console.error('XML parsing error detected');
      // Try regex fallback for malformed XML
      const idMatches = xmlData.match(/<Id>(\d+)<\/Id>/g) || [];
      return idMatches.map(match => match.replace(/<\/?Id>/g, ''));
    }
    
    const idNodes = xmlDoc.getElementsByTagName('Id');
    return Array.from(idNodes).map(node => node.textContent || '').filter(id => id);
  } catch (error) {
    console.error('Error parsing PubMed XML:', error);
    // Final fallback - return empty array to prevent app crash
    return [];
  }
};

/**
 * Fetch detailed article information using efetch
 * @param {Array<string>} articleIds - Array of PubMed IDs
 * @returns {Promise<Array>} Array of article objects
 */
const fetchArticleDetails = async (articleIds) => {
  if (articleIds.length === 0) return [];

  try {
    const fetchParams = new URLSearchParams({
      db: 'pubmed',
      id: articleIds.join(','),
      retmode: 'xml',
      rettype: 'abstract'
    });

    if (API_KEY) {
      fetchParams.append('api_key', API_KEY);
    }

    const fetchUrl = `${PUBMED_BASE_URL}/efetch.fcgi?${fetchParams}`;
    
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch article details: ${response.status}`);
    }

    const xmlData = await response.text();
    return parseArticleDetails(xmlData);

  } catch (error) {
    console.error('Error fetching article details:', error);
    return [];
  }
};

/**
 * Parse article details from PubMed XML response
 * @param {string} xmlData - XML response from efetch
 * @returns {Array} Array of parsed article objects
 */
const parseArticleDetails = (xmlData) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
    const articles = xmlDoc.getElementsByTagName('PubmedArticle');

    return Array.from(articles).map(article => {
      const medlineCitation = article.querySelector('MedlineCitation');
      const pubmedData = article.querySelector('PubmedData');

      // Extract basic information
      const pmid = medlineCitation?.querySelector('PMID')?.textContent || '';
      const title = medlineCitation?.querySelector('ArticleTitle')?.textContent || '';
      const abstract = medlineCitation?.querySelector('Abstract AbstractText')?.textContent || '';
      
      // Extract authors
      const authorNodes = medlineCitation?.querySelectorAll('Author') || [];
      const authors = Array.from(authorNodes).map(author => {
        const lastName = author.querySelector('LastName')?.textContent || '';
        const foreName = author.querySelector('ForeName')?.textContent || '';
        return `${foreName} ${lastName}`.trim();
      }).filter(name => name.length > 0);

      // Extract journal information
      const journal = medlineCitation?.querySelector('Journal Title')?.textContent || '';
      const pubDate = extractPublicationDate(medlineCitation);

      // Extract DOI if available
      const doi = Array.from(medlineCitation?.querySelectorAll('ArticleId') || [])
        .find(id => id.getAttribute('IdType') === 'doi')?.textContent || '';

      return {
        pmid,
        title,
        abstract,
        authors: authors.slice(0, 5), // Limit to first 5 authors
        journal,
        publicationDate: pubDate,
        doi,
        pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        relevanceScore: calculateRelevanceScore(title, abstract)
      };
    }).filter(article => article.pmid && article.title);

  } catch (error) {
    console.error('Error parsing article details:', error);
    return [];
  }
};

/**
 * Extract publication date from article XML
 * @param {Element} medlineCitation - MedlineCitation XML element
 * @returns {string} Formatted publication date
 */
const extractPublicationDate = (medlineCitation) => {
  try {
    const pubDate = medlineCitation?.querySelector('PubDate');
    if (!pubDate) return '';

    const year = pubDate.querySelector('Year')?.textContent || '';
    const month = pubDate.querySelector('Month')?.textContent || '';
    const day = pubDate.querySelector('Day')?.textContent || '';

    if (year && month && day) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (year && month) {
      return `${year}-${month.padStart(2, '0')}`;
    } else if (year) {
      return year;
    }

    return '';
  } catch (error) {
    return '';
  }
};

/**
 * Calculate relevance score for medical education content
 * @param {string} title - Article title
 * @param {string} abstract - Article abstract
 * @returns {number} Relevance score (0-100)
 */
const calculateRelevanceScore = (title, abstract) => {
  const text = `${title} ${abstract}`.toLowerCase();
  let score = 50; // Base score

  // Medical education keywords
  const educationKeywords = [
    'guideline', 'recommendation', 'consensus', 'standard', 'protocol',
    'treatment', 'therapy', 'clinical', 'pediatric', 'antibiotic',
    'antimicrobial', 'resistance', 'stewardship', 'infection'
  ];

  // Quality indicators
  const qualityKeywords = [
    'systematic review', 'meta-analysis', 'randomized', 'controlled',
    'multicenter', 'prospective', 'evidence-based'
  ];

  // Check for education keywords
  educationKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 3;
    }
  });

  // Check for quality indicators
  qualityKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 5;
    }
  });

  // Bonus for recent guidelines
  if (text.includes('2024') || text.includes('2023')) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
};

/**
 * Cache management for PubMed results
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const cache = new Map();

/**
 * Get cached results or fetch new ones
 * @param {string} cacheKey - Unique cache identifier
 * @param {Function} fetchFunction - Function to fetch new data
 * @returns {Promise} Cached or fresh data
 */
export const getCachedResults = async (cacheKey, fetchFunction) => {
  const cached = cache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const freshData = await fetchFunction();
    cache.set(cacheKey, {
      data: freshData,
      timestamp: Date.now()
    });
    return freshData;
  } catch (error) {
    // Return cached data if available, even if expired
    if (cached) {
      console.warn('Using expired cache due to fetch error:', error);
      return cached.data;
    }
    throw error;
  }
};

/**
 * Clear the PubMed cache
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Get cache statistics
 * @returns {Object} Cache usage statistics
 */
export const getCacheStats = () => {
  const now = Date.now();
  const entries = Array.from(cache.entries());
  const activeEntries = entries.filter(([, value]) => 
    (now - value.timestamp) < CACHE_DURATION
  );
  
  return {
    totalEntries: entries.length,
    activeEntries: activeEntries.length,
    expiredEntries: entries.length - activeEntries.length,
    oldestEntry: entries.length > 0 
      ? Math.min(...entries.map(([, value]) => value.timestamp))
      : null,
    cacheSize: entries.reduce((size, [key, value]) => 
      size + JSON.stringify({ key, value }).length, 0
    )
  };
};

/**
 * Simple cache setter for testing
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const setCachedResults = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Simple cache getter for testing
 * @param {string} key - Cache key
 * @returns {any} Cached data or null
 */
export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  // Check if expired
  if ((Date.now() - cached.timestamp) >= CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

// Export all functions
export default {
  searchPubMed,
  getAntibioticGuidelines,
  getResistancePatterns,
  getPediatricGuidelines,
  getCachedResults,
  setCachedResults,
  getCachedData,
  clearCache,
  getCacheStats
};