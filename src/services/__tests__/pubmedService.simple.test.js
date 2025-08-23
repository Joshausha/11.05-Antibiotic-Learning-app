/**
 * PubMed Service Simple Tests
 * Medical Literature Integration - Core API Functions
 * Focus on essential medical education functionality
 */

import {
  searchPubMed,
  getAntibioticGuidelines,
  getPediatricGuidelines,
  getResistancePatterns,
  clearCache,
  getCacheStats
} from '../pubmedService';

// Mock fetch for API testing
global.fetch = jest.fn();

describe('PubMed Service - Medical Education Core', () => {
  beforeEach(() => {
    // Clear only specific mocks, preserve global DOMParser mock from setupTests.js
    fetch.mockClear();
    clearCache();
  });

  describe('Core Search Functionality', () => {
    test('searchPubMed makes proper API calls for medical queries', async () => {
      const mockSearchXML = `<?xml version="1.0"?>
        <eSearchResult>
          <Count>2</Count>
          <IdList>
            <Id>12345678</Id>
            <Id>87654321</Id>
          </IdList>
        </eSearchResult>`;

      const mockArticleXML = `<?xml version="1.0"?>
        <PubmedArticleSet>
          <PubmedArticle>
            <MedlineCitation>
              <PMID>12345678</PMID>
              <ArticleTitle>Pediatric Antibiotic Guidelines</ArticleTitle>
              <Abstract><AbstractText>Medical education content</AbstractText></Abstract>
            </MedlineCitation>
          </PubmedArticle>
        </PubmedArticleSet>`;

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockSearchXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      const results = await searchPubMed('pediatric antibiotics');

      // Verify API calls were made
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('esearch.fcgi')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('efetch.fcgi')
      );

      // Verify result structure
      expect(results).toHaveProperty('query');
      expect(results).toHaveProperty('articles');
      expect(results).toHaveProperty('totalResults');
      expect(results.query).toBe('pediatric antibiotics');
    });

    test('searchPubMed handles empty results gracefully', async () => {
      const emptySearchXML = `<?xml version="1.0"?>
        <eSearchResult>
          <Count>0</Count>
          <IdList></IdList>
        </eSearchResult>`;

      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(emptySearchXML)
      });

      const results = await searchPubMed('nonexistent medical term');

      expect(results.totalResults).toBe(0);
      expect(results.articles).toEqual([]);
    });

    test('searchPubMed handles API errors appropriately', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(searchPubMed('test query')).rejects.toThrow('Failed to search PubMed');
    });

    test('searchPubMed applies medical content filters', async () => {
      const mockSearchXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockSearchXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      await searchPubMed('pneumonia treatment', {
        maxResults: 5,
        dateRange: '2',
        filters: ['clinical trial[pt]']
      });

      const firstCall = fetch.mock.calls[0];
      const searchUrl = firstCall[0];

      expect(searchUrl).toContain('retmax=5');
      expect(searchUrl).toContain('reldate=2');
      expect(searchUrl).toContain('hasabstract');
    });
  });

  describe('Medical Specialty Functions', () => {
    test('getAntibioticGuidelines searches for drug-specific guidance', async () => {
      const mockXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      const guidelines = await getAntibioticGuidelines('vancomycin');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('vancomycin')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('guidelines')
      );
      expect(guidelines).toHaveProperty('articles');
    });

    test('getPediatricGuidelines searches for age-appropriate content', async () => {
      const mockXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      const pediatricGuidelines = await getPediatricGuidelines('pneumonia');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];

      expect(searchUrl).toContain('pneumonia');
      expect(searchUrl).toContain('pediatric');
      expect(pediatricGuidelines).toHaveProperty('articles');
    });

    test('getResistancePatterns searches for antimicrobial resistance data', async () => {
      const mockXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      const resistanceData = await getResistancePatterns('MRSA');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];

      expect(searchUrl).toContain('MRSA');
      expect(searchUrl).toContain('resistance');
      expect(resistanceData).toHaveProperty('articles');
    });
  });

  describe('Medical Education Support', () => {
    test('supports evidence-based learning workflows', async () => {
      const mockXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      const results = await searchPubMed('evidence-based antibiotic prescribing');

      expect(results.query).toContain('evidence-based');
      expect(results).toHaveProperty('searchTime');
      expect(results.articles).toBeDefined();
    });

    test('integrates with clinical decision support', async () => {
      const mockXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      // Simulate workflow: Get general and pediatric guidelines
      await getAntibioticGuidelines('ceftriaxone');
      await getPediatricGuidelines('meningitis', 'ceftriaxone');

      expect(fetch).toHaveBeenCalledTimes(4); // 2 searches × 2 API calls each
    });
  });

  describe('Cache Management', () => {
    test('provides cache statistics', () => {
      const stats = getCacheStats();

      expect(stats).toHaveProperty('totalEntries');
      expect(stats).toHaveProperty('activeEntries');
      expect(stats).toHaveProperty('expiredEntries');
      expect(typeof stats.totalEntries).toBe('number');
    });

    test('clears cache successfully', () => {
      clearCache();
      const stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('handles HTTP errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(searchPubMed('test query')).rejects.toThrow('Failed to search PubMed');
    });

    test('handles malformed responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('invalid xml content')
      });

      // Should return empty results rather than crashing
      const results = await searchPubMed('test query');
      expect(results.totalResults).toBe(0);
      expect(results.articles).toEqual([]);
    });

    test('validates input safely', async () => {
      const mockXML = '<eSearchResult><Count>0</Count><IdList></IdList></eSearchResult>';
      
      fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockXML)
      });

      // Empty query should work
      const results = await searchPubMed('');
      expect(results.query).toBe('');
      expect(results.totalResults).toBe(0);
    });
  });

  describe('Medical Content Quality', () => {
    test('applies appropriate filters for medical education', async () => {
      const mockXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      await searchPubMed('pediatric infectious diseases');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];

      // Should include quality filters
      expect(searchUrl).toContain('hasabstract');
      expect(searchUrl).toContain('English');
    });

    test('supports clinical guideline searches', async () => {
      const mockXML = '<eSearchResult><Count>1</Count><IdList><Id>123</Id></IdList></eSearchResult>';
      const mockArticleXML = '<PubmedArticleSet></PubmedArticleSet>';

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXML)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
        });

      await getAntibioticGuidelines('penicillin', 'strep throat');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];

      expect(searchUrl).toContain('penicillin');
      expect(searchUrl).toContain('strep+throat'); // URL encoded space becomes +
      expect(searchUrl).toContain('guidelines');
    });
  });
});