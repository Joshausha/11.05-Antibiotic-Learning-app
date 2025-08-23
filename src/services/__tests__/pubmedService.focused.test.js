/**
 * PubMed Service Focused Tests
 * Medical Literature Integration - Core Functions Only
 * Tests actual existing functions for clinical research access
 */

import {
  searchPubMed,
  getAntibioticGuidelines,
  getPediatricGuidelines,
  getResistancePatterns,
  getCachedResults,
  clearCache,
  getCacheStats
} from '../pubmedService';

// Mock fetch for API testing
global.fetch = jest.fn();

describe('PubMed Service - Core Medical Functions', () => {
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

  beforeEach(() => {
    // Clear only specific mocks, preserve global DOMParser mock from setupTests.js
    fetch.mockClear();
    clearCache();
  });

  describe('Core Search - searchPubMed', () => {
    test('successfully searches PubMed with medical terms', async () => {
      // Ensure mock returns specific XML content that our parser can handle
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const results = await searchPubMed('pediatric antibiotic resistance');

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('esearch.fcgi')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('efetch.fcgi')
      );
      
      expect(results).toHaveProperty('query', 'pediatric antibiotic resistance');
      expect(results).toHaveProperty('articles');
      expect(results).toHaveProperty('totalResults');
      expect(results).toHaveProperty('searchTime');
      expect(results.totalResults).toBeGreaterThan(0);
    });

    test('handles empty search results for medical queries', async () => {
      const emptyXMLResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <eSearchResult>
          <Count>0</Count>
          <IdList></IdList>
        </eSearchResult>`;

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(emptyXMLResponse)
      });

      const results = await searchPubMed('extremely rare nonexistent condition');

      expect(results.totalResults).toBe(0);
      expect(results.articles).toEqual([]);
      expect(results.query).toBe('extremely rare nonexistent condition');
    });

    test('handles API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(searchPubMed('test query')).rejects.toThrow('Failed to search PubMed');
    });

    test('applies medical literature filters', async () => {
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
      
      // Should include medical filters (check URL encoded versions)
      expect(searchUrl).toContain('hasabstract');
      expect(searchUrl).toContain('English%5Blang%5D'); // URL encoded version of English[lang]
      expect(searchUrl).toContain('clinical+trial%5Bpt%5D'); // URL encoded version
      expect(searchUrl).toContain('retmax=10');
      expect(searchUrl).toContain('reldate=3');
    });
  });

  describe('Antibiotic Guidelines - getAntibioticGuidelines', () => {
    test('searches for antibiotic-specific guidelines', async () => {
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
      // The function uses "pediatric OR children OR infant" not child[mh]
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
    test('retrieves cached results for performance', async () => {
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
  });

  describe('Medical Education Integration', () => {
    test('searches support evidence-based learning', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const results = await searchPubMed('evidence-based antibiotic selection pediatrics');

      expect(results.query).toContain('evidence-based');
      expect(results.query).toContain('pediatrics');
      expect(results).toHaveProperty('searchTime');
      
      // Should include quality filters for educational content
      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      expect(searchUrl).toContain('hasabstract');
      expect(searchUrl).toContain('English%5Blang%5D'); // URL encoded version
    });

    test('supports clinical decision making workflows', async () => {
      // Mock 4 fetch calls: 2 functions × 2 calls each (search + fetch details)
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      // Simulate clinical decision support query
      await getAntibioticGuidelines('ceftriaxone', 'meningitis');
      await getPediatricGuidelines('meningitis', 'ceftriaxone');

      // Should make multiple focused searches for comprehensive guidance
      expect(fetch).toHaveBeenCalledTimes(4); // 2 searches × 2 calls each
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles malformed XML responses', async () => {
      const malformedXML = 'not valid xml content';

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(malformedXML)
      });

      // The service should handle malformed XML gracefully and return empty results
      const results = await searchPubMed('test query');
      
      expect(results.totalResults).toBe(0);
      expect(results.articles).toEqual([]);
      expect(results.query).toBe('test query');
    });

    test('handles HTTP error responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(searchPubMed('test query')).rejects.toThrow('Failed to search PubMed');
    });

    test('validates input parameters', async () => {
      // Empty query should still work (PubMed will handle it)
      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLArticleResponse)
        });

      const results = await searchPubMed('');
      expect(results.query).toBe('');
    });
  });
});