/**
 * PubMed Service Tests
 * Medical Literature Integration for Evidence-Based Learning
 * Tests critical API integration for clinical research access
 */

import {
  searchPubMed,
  getAntibioticGuidelines,
  getPediatricGuidelines,
  getResistancePatterns,
  getCachedResults,
  setCachedResults,
  getCachedData,
  clearCache,
  getCacheStats
} from '../pubmedService';

// Mock fetch for API testing
global.fetch = jest.fn();

// Global mock XML responses for all tests
const mockXMLSearchResponse = `<?xml version="1.0" encoding="UTF-8"?>
  <eSearchResult>
    <Count>2</Count>
    <IdList>
      <Id>12345678</Id>
      <Id>87654321</Id>
    </IdList>
  </eSearchResult>`;

const mockXMLArticleResponse = `<?xml version="1.0" encoding="UTF-8"?>
  <PubmedArticleSet>
    <PubmedArticle>
      <MedlineCitation>
        <PMID>12345678</PMID>
        <ArticleTitle>Antibiotic resistance in pediatric populations</ArticleTitle>
        <Abstract>
          <AbstractText>Study on antibiotic resistance patterns in children...</AbstractText>
        </Abstract>
        <AuthorList>
          <Author>
            <LastName>Smith</LastName>
            <ForeName>John</ForeName>
          </Author>
        </AuthorList>
        <Journal>
          <Title>Pediatric Infectious Diseases Journal</Title>
        </Journal>
        <PubDate>
          <Year>2024</Year>
          <Month>Jan</Month>
        </PubDate>
      </MedlineCitation>
    </PubmedArticle>
  </PubmedArticleSet>`;

describe('PubMed Service - Medical Literature Integration', () => {
  beforeEach(() => {
    // Clear only specific mocks, preserve global DOMParser mock from setupTests.js
    fetch.mockClear();
    clearCache();
  });

  describe('Core Search Functionality - searchPubMed', () => {

    test('searches PubMed with medical query parameters', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const results = await searchPubMed('antibiotic resistance pediatric');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('esearch.fcgi')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('efetch.fcgi')
      );
      expect(results).toBeDefined();
      expect(results).toHaveProperty('articles');
      expect(results).toHaveProperty('totalResults');
      expect(results).toHaveProperty('query');
      expect(Array.isArray(results.articles)).toBe(true);
      expect(results.totalResults).toBeGreaterThan(0);
    });

    test('applies medical literature filters correctly', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      await searchPubMed('pneumonia treatment', {
        maxResults: 10,
        dateRange: '3',
        sortBy: 'date',
        filters: ['clinical trial[pt]']
      });

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('hasabstract');
      expect(searchUrl).toContain('English%5Blang%5D'); // URL encoded version of English[lang]
      expect(searchUrl).toContain('clinical+trial%5Bpt%5D'); // URL encoded version of clinical trial[pt]
      expect(searchUrl).toContain('retmax=10');
      expect(searchUrl).toContain('reldate=3');
    });

    test('handles API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(searchPubMed('test query')).rejects.toThrow('Failed to search PubMed');
    });

    test('validates search results for medical content', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const results = await searchPubMed('antibiotic guidelines');

      expect(results.articles[0]).toHaveProperty('title');
      expect(results.articles[0]).toHaveProperty('authors');
      expect(results.articles[0]).toHaveProperty('journal');
      expect(results.articles[0]).toHaveProperty('pmid');
      expect(results.articles[0]).toHaveProperty('relevanceScore');
    });
  });

  describe('Antibiotic Guidelines - getAntibioticGuidelines', () => {
    test('searches for antibiotic-specific clinical guidelines', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const guidelines = await getAntibioticGuidelines('vancomycin');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('vancomycin')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('guidelines')
      );
      expect(guidelines).toHaveProperty('articles');
      expect(guidelines.query).toContain('vancomycin');
      expect(guidelines.query).toContain('guidelines');
    });

    test('includes indication-specific searches', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      await getAntibioticGuidelines('penicillin', 'pneumonia');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('penicillin');
      expect(searchUrl).toContain('pneumonia');
      expect(searchUrl).toContain('guidelines');
    });
  });

  describe('Pediatric Guidelines - getPediatricGuidelines', () => {
    test('searches for pediatric-specific medical guidelines', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const pediatricGuidelines = await getPediatricGuidelines('pneumonia');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('pneumonia');
      expect(searchUrl).toContain('pediatric');
      expect(searchUrl).toContain('children');
      expect(pediatricGuidelines).toHaveProperty('articles');
      expect(pediatricGuidelines.query).toContain('pediatric');
    });

    test('includes antibiotic-specific pediatric searches', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      await getPediatricGuidelines('sepsis', 'vancomycin');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('sepsis');
      expect(searchUrl).toContain('vancomycin');
      expect(searchUrl).toContain('pediatric');
    });
  });

  describe('Resistance Patterns - getResistancePatterns', () => {
    test('searches for antimicrobial resistance data', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const resistanceData = await getResistancePatterns('MRSA');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('MRSA');
      expect(searchUrl).toContain('resistance');
      expect(searchUrl).toContain('surveillance');
      expect(resistanceData).toHaveProperty('articles');
      expect(resistanceData.query).toContain('resistance');
    });

    test('includes regional resistance patterns', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      await getResistancePatterns('E. coli', 'North America');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('E.+coli'); // URL encoding converts space to +
      expect(searchUrl).toContain('North+America'); // URL encoding converts space to +
      expect(searchUrl).toContain('resistance');
    });
  });

  describe('Caching System', () => {
    test('caches search results for performance', async () => {
      // First call - should hit API
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const cachedResults = await getCachedResults(
        'test-cache-key',
        () => searchPubMed('cached query')
      );

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(cachedResults).toHaveProperty('articles');

      // Second call - should use cache (no additional fetch calls)
      const cachedResults2 = await getCachedResults(
        'test-cache-key',
        () => searchPubMed('cached query')
      );

      expect(fetch).toHaveBeenCalledTimes(2); // No additional calls
      expect(cachedResults2).toEqual(cachedResults);
    });

    test('provides cache statistics', () => {
      const stats = getCacheStats();
      
      expect(stats).toHaveProperty('totalEntries');
      expect(stats).toHaveProperty('activeEntries');
      expect(stats).toHaveProperty('expiredEntries');
      expect(typeof stats.totalEntries).toBe('number');
    });

    test('clears cache completely', () => {
      // Add something to cache first
      getCachedResults('test-key', () => Promise.resolve({ test: 'data' }));
      
      clearCache();
      
      const stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });

    test('manual cache operations work correctly', () => {
      const mockResults = { articles: [], totalResults: 0 };
      setCachedResults('test-query', mockResults);

      const cached = getCachedData('test-query');
      expect(cached).toEqual(mockResults);

      // Test non-existent key
      const nonExistent = getCachedData('non-existent-query');
      expect(nonExistent).toBeNull();
    });
  });
});