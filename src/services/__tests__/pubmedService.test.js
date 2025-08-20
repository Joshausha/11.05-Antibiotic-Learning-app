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

describe('PubMed Service - Medical Literature Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    // Clear cache before each test
    clearCache();
  });

  describe('Core Search Functionality - searchPubMed', () => {
    const mockSearchResponse = {
      esearchresult: {
        count: '5',
        retmax: '5',
        idlist: ['12345678', '87654321', '11223344', '44332211', '55667788']
      }
    };

    const mockDetailsResponse = {
      result: {
        '12345678': {
          title: 'Antibiotic resistance in pediatric populations',
          authors: [
            { name: 'Smith J', authtype: 'Author' },
            { name: 'Johnson K', authtype: 'Author' }
          ],
          pubdate: '2024',
          source: 'Pediatric Infectious Diseases Journal',
          doi: '10.1097/INF.0000000000003456',
          abstract: 'Study on antibiotic resistance patterns in children...'
        },
        '87654321': {
          title: 'Vancomycin dosing in pediatric patients',
          authors: [
            { name: 'Davis L', authtype: 'Author' }
          ],
          pubdate: '2023',
          source: 'Journal of Pediatric Pharmacology',
          doi: '10.1177/8756479323123456',
          abstract: 'Guidelines for vancomycin dosing in pediatric populations...'
        }
      }
    };

    test('searches PubMed with medical query parameters', async () => {
      const mockXMLResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <eSearchResult>
          <Count>2</Count>
          <IdList>
            <Id>12345678</Id>
            <Id>87654321</Id>
          </IdList>
        </eSearchResult>`;

      const mockArticleXML = `<?xml version="1.0" encoding="UTF-8"?>
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
            </MedlineCitation>
          </PubmedArticle>
        </PubmedArticleSet>`;

      fetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockXMLResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(mockArticleXML)
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
    });

    test('applies medical literature filters correctly', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockDetailsResponse)
        });

      await searchPubMed('pneumonia treatment', {
        maxResults: 10,
        dateRange: '3',
        sortBy: 'date',
        filters: ['clinical trial[pt]', 'child[mh]']
      });

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('hasabstract');
      expect(searchUrl).toContain('English[lang]');
      expect(searchUrl).toContain('clinical%20trial[pt]');
      expect(searchUrl).toContain('child[mh]');
    });

    test('handles API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const results = await searchPubMed('test query');

      expect(results.error).toBeTruthy();
      expect(results.articles).toEqual([]);
    });

    test('validates search results for medical content', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSearchResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockDetailsResponse)
        });

      const results = await searchPubMed('antibiotic guidelines');

      expect(results.articles[0]).toHaveProperty('title');
      expect(results.articles[0]).toHaveProperty('authors');
      expect(results.articles[0]).toHaveProperty('pubdate');
      expect(results.articles[0]).toHaveProperty('source');
      expect(results.articles[0]).toHaveProperty('relevanceScore');
    });
  });

  describe('Antibiotic Guidelines - getAntibioticGuidelines', () => {
    test('searches for antibiotic-specific clinical guidelines', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            esearchresult: { count: '3', idlist: ['123', '456', '789'] }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            result: {
              '123': {
                title: 'Vancomycin therapeutic guidelines 2024',
                source: 'Clinical Infectious Diseases',
                pubdate: '2024',
                abstract: 'Updated guidelines for vancomycin use...'
              }
            }
          })
        });

      const guidelines = await getAntibioticGuidelines('vancomycin');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('vancomycin'),
        expect.any(Object)
      );
      expect(guidelines.articles).toBeDefined();
      expect(guidelines.articles[0].title).toContain('Vancomycin');
    });

    test('includes resistance pattern considerations', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            esearchresult: { count: '2', idlist: ['111', '222'] }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            result: {
              '111': {
                title: 'Penicillin resistance patterns in Streptococcus pneumoniae',
                source: 'Antimicrobial Agents and Chemotherapy',
                pubdate: '2023'
              }
            }
          })
        });

      const guidelines = await getAntibioticGuidelines('penicillin');
      
      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('resistance');
      expect(searchUrl).toContain('guideline');
    });
  });

  describe('Pediatric Guidelines - getPediatricGuidelines', () => {
    test('searches for pediatric-specific medical guidelines', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            esearchresult: { count: '4', idlist: ['child1', 'child2'] }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            result: {
              'child1': {
                title: 'Pediatric pneumonia treatment guidelines',
                source: 'Pediatrics',
                pubdate: '2024',
                abstract: 'Evidence-based guidelines for treating pneumonia in children...'
              }
            }
          })
        });

      const pediatricGuidelines = await getPediatricGuidelines('pneumonia');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('child[mh]');
      expect(searchUrl).toContain('pediatric');
      expect(searchUrl).toContain('pneumonia');
      expect(pediatricGuidelines.articles[0].title).toContain('Pediatric');
    });

    test('applies age-appropriate medical filters', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            esearchresult: { count: '1', idlist: ['ped123'] }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            result: {
              'ped123': {
                title: 'Antibiotic dosing in neonates and infants',
                source: 'Journal of Pediatric Infectious Diseases'
              }
            }
          })
        });

      await getPediatricGuidelines('antibiotic dosing', { 
        ageGroups: ['neonate', 'infant'] 
      });

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('neonate');
      expect(searchUrl).toContain('infant');
    });
  });

  describe('Resistance Patterns - getResistancePatterns', () => {
    test('searches for antimicrobial resistance data', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            esearchresult: { count: '6', idlist: ['res1', 'res2', 'res3'] }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            result: {
              'res1': {
                title: 'MRSA resistance patterns in pediatric hospitals',
                source: 'Infection Control and Hospital Epidemiology',
                pubdate: '2024',
                abstract: 'Surveillance data on MRSA resistance...'
              }
            }
          })
        });

      const resistanceData = await getResistancePatterns('MRSA', 'vancomycin');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('resistance');
      expect(searchUrl).toContain('MRSA');
      expect(searchUrl).toContain('vancomycin');
      expect(resistanceData.articles[0].title).toContain('resistance');
    });

    test('includes surveillance and epidemiology data', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            esearchresult: { count: '3', idlist: ['epi1'] }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            result: {
              'epi1': {
                title: 'Global surveillance of antibiotic resistance',
                source: 'Lancet Infectious Diseases'
              }
            }
          })
        });

      await getResistancePatterns('E. coli', 'ampicillin');

      const searchCall = fetch.mock.calls[0];
      const searchUrl = searchCall[0];
      
      expect(searchUrl).toContain('surveillance');
      expect(searchUrl).toContain('epidemiology');
    });
  });

  describe('Relevance Scoring - calculateRelevanceScore', () => {
    const mockArticle = {
      title: 'Pediatric antibiotic resistance in Staphylococcus aureus',
      abstract: 'This study examines antibiotic resistance patterns in pediatric patients with Staphylococcus aureus infections. Vancomycin remains effective against MRSA.',
      source: 'Pediatric Infectious Diseases Journal',
      pubdate: '2024'
    };

    test('calculates relevance based on medical keywords', () => {
      const keywords = ['antibiotic', 'resistance', 'pediatric'];
      const score = calculateRelevanceScore(mockArticle, keywords);

      expect(score).toBeGreaterThan(0);
      expect(typeof score).toBe('number');
    });

    test('prioritizes pediatric medical content', () => {
      const pediatricKeywords = ['pediatric', 'child', 'antibiotic'];
      const generalKeywords = ['antibiotic', 'adult', 'treatment'];

      const pediatricScore = calculateRelevanceScore(mockArticle, pediatricKeywords);
      const generalScore = calculateRelevanceScore(mockArticle, generalKeywords);

      expect(pediatricScore).toBeGreaterThan(generalScore);
    });

    test('weights recent publications higher', () => {
      const recentArticle = { ...mockArticle, pubdate: '2024' };
      const olderArticle = { ...mockArticle, pubdate: '2020' };

      const recentScore = calculateRelevanceScore(recentArticle, ['antibiotic']);
      const olderScore = calculateRelevanceScore(olderArticle, ['antibiotic']);

      expect(recentScore).toBeGreaterThan(olderScore);
    });

    test('considers journal reputation in scoring', () => {
      const highImpactJournal = { ...mockArticle, source: 'New England Journal of Medicine' };
      const standardJournal = { ...mockArticle, source: 'General Medical Journal' };

      const highImpactScore = calculateRelevanceScore(highImpactJournal, ['antibiotic']);
      const standardScore = calculateRelevanceScore(standardJournal, ['antibiotic']);

      expect(highImpactScore).toBeGreaterThan(standardScore);
    });
  });

  describe('Medical Query Validation - validateMedicalQuery', () => {
    test('validates proper medical terminology', () => {
      const validQueries = [
        'antibiotic resistance',
        'Staphylococcus aureus',
        'pediatric pneumonia',
        'vancomycin dosing'
      ];

      validQueries.forEach(query => {
        expect(validateMedicalQuery(query)).toBe(true);
      });
    });

    test('rejects invalid or unsafe queries', () => {
      const invalidQueries = [
        '',
        'a',
        'select * from',
        '<script>',
        'javascript:'
      ];

      invalidQueries.forEach(query => {
        expect(validateMedicalQuery(query)).toBe(false);
      });
    });

    test('sanitizes query for medical search safety', () => {
      const unsafeQuery = 'antibiotic<script>alert("xss")</script>';
      expect(validateMedicalQuery(unsafeQuery)).toBe(false);
    });
  });

  describe('Query Building - buildMedicalQuery', () => {
    test('constructs proper PubMed query syntax', () => {
      const query = buildMedicalQuery('pneumonia', {
        pathogen: 'Streptococcus pneumoniae',
        antibiotic: 'penicillin',
        population: 'pediatric'
      });

      expect(query).toContain('pneumonia');
      expect(query).toContain('Streptococcus pneumoniae');
      expect(query).toContain('penicillin');
      expect(query).toContain('child[mh]');
    });

    test('includes appropriate medical subject headings (MeSH)', () => {
      const query = buildMedicalQuery('antibiotic resistance');

      expect(query).toContain('Anti-Bacterial Agents[mh]');
      expect(query).toContain('Drug Resistance, Bacterial[mh]');
    });
  });

  describe('Keyword Extraction - extractKeywords', () => {
    test('extracts medical keywords from query', () => {
      const keywords = extractKeywords('pediatric antibiotic resistance MRSA');

      expect(keywords).toContain('pediatric');
      expect(keywords).toContain('antibiotic');
      expect(keywords).toContain('resistance');
      expect(keywords).toContain('MRSA');
    });

    test('handles medical abbreviations correctly', () => {
      const keywords = extractKeywords('MRSA UTI NICU');

      expect(keywords).toContain('MRSA');
      expect(keywords).toContain('UTI');
      expect(keywords).toContain('NICU');
    });
  });

  describe('Caching System', () => {
    test('caches search results for performance', async () => {
      const mockResults = { articles: [], total: '0' };
      setCachedResults('test-query', mockResults);

      const cached = getCachedData('test-query');
      expect(cached).toEqual(mockResults);
    });

    test('returns null for non-cached queries', () => {
      const cached = getCachedData('non-existent-query');
      expect(cached).toBeNull();
    });

    test('clears cache completely', () => {
      setCachedResults('query1', { articles: [] });
      setCachedResults('query2', { articles: [] });
      
      clearCache();
      
      expect(getCachedData('query1')).toBeNull();
      expect(getCachedData('query2')).toBeNull();
    });
  });

  describe('Result Formatting - formatPubMedResults', () => {
    test('formats search results for medical education display', () => {
      const rawResults = {
        result: {
          '123': {
            title: 'Test Article',
            authors: [{ name: 'Author A' }],
            pubdate: '2024',
            source: 'Test Journal'
          }
        }
      };

      const formatted = formatPubMedResults(rawResults, ['test']);

      expect(formatted[0]).toHaveProperty('id');
      expect(formatted[0]).toHaveProperty('title');
      expect(formatted[0]).toHaveProperty('authors');
      expect(formatted[0]).toHaveProperty('year');
      expect(formatted[0]).toHaveProperty('journal');
      expect(formatted[0]).toHaveProperty('relevanceScore');
    });

    test('handles missing article data gracefully', () => {
      const incompleteResults = {
        result: {
          '456': {
            title: 'Incomplete Article'
            // Missing other fields
          }
        }
      };

      const formatted = formatPubMedResults(incompleteResults, ['test']);

      expect(formatted[0].title).toBe('Incomplete Article');
      expect(formatted[0].authors).toBe('Unknown');
      expect(formatted[0].journal).toBe('Unknown');
    });
  });

  describe('Integration Testing', () => {
    test('complete workflow: search to formatted results', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            esearchresult: { count: '1', idlist: ['integration123'] }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            result: {
              'integration123': {
                title: 'Integration test article on pediatric antibiotics',
                authors: [{ name: 'Test Author' }],
                pubdate: '2024',
                source: 'Test Medical Journal',
                abstract: 'This is a test abstract about pediatric antibiotic use.'
              }
            }
          })
        });

      const results = await searchPubMed('pediatric antibiotics');

      expect(results.articles).toHaveLength(1);
      expect(results.articles[0].title).toContain('pediatric antibiotics');
      expect(results.articles[0]).toHaveProperty('relevanceScore');
      expect(results.total).toBe('1');
    });
  });
});