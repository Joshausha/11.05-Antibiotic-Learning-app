/**
 * Research Integration Component
 * Displays PubMed research results and evidence-based guidelines
 * Integrates with medical education content for real-time validation
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Calendar, 
  Users, 
  Award,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import pubmedService from '../../services/pubmedService';

const ResearchIntegration = ({ 
  topic = '', 
  pathogen = '', 
  antibiotic = '',
  className = '' 
}) => {
  const [research, setResearch] = useState({
    guidelines: [],
    resistance: [],
    pediatric: [],
    loading: false,
    error: null,
    lastUpdated: null
  });
  
  const [activeTab, setActiveTab] = useState('guidelines');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '3',
    studyType: 'all',
    sortBy: 'relevance'
  });

  // Determine search strategy based on props
  const searchStrategy = useMemo(() => {
    if (antibiotic && pathogen) {
      return {
        type: 'specific',
        query: `"${antibiotic}" AND "${pathogen}"`,
        description: `Research for ${antibiotic} against ${pathogen}`
      };
    } else if (antibiotic) {
      return {
        type: 'antibiotic',
        query: antibiotic,
        description: `Guidelines for ${antibiotic}`
      };
    } else if (pathogen) {
      return {
        type: 'pathogen',
        query: pathogen,
        description: `Research on ${pathogen}`
      };
    } else if (topic) {
      return {
        type: 'topic',
        query: topic,
        description: `Research on ${topic}`
      };
    }
    return null;
  }, [antibiotic, pathogen, topic]);

  // Fetch research data
  const fetchResearch = useCallback(async (forceRefresh = false) => {
    if (!searchStrategy) return;

    setResearch(prev => ({ ...prev, loading: true, error: null }));

    try {
      const cacheKey = `research_${searchStrategy.type}_${searchStrategy.query}`;
      
      const fetchFunction = async () => {
        const promises = [];

        // Guidelines search
        if (antibiotic) {
          promises.push(
            pubmedService.getAntibioticGuidelines(antibiotic, pathogen || topic)
          );
        } else {
          promises.push(
            pubmedService.searchPubMed(`${searchStrategy.query} AND guidelines`, {
              maxResults: 10,
              filters: ['guideline', 'systematic review']
            })
          );
        }

        // Resistance patterns
        if (pathogen) {
          promises.push(
            pubmedService.getResistancePatterns(pathogen)
          );
        } else {
          promises.push(
            pubmedService.searchPubMed(`${searchStrategy.query} AND resistance`, {
              maxResults: 10,
              filters: ['surveillance', 'epidemiology']
            })
          );
        }

        // Pediatric guidelines
        promises.push(
          pubmedService.getPediatricGuidelines(topic || pathogen || antibiotic)
        );

        const [guidelines, resistance, pediatric] = await Promise.all(promises);

        return { guidelines, resistance, pediatric };
      };

      let results;
      if (forceRefresh) {
        results = await fetchFunction();
      } else {
        results = await pubmedService.getCachedResults(cacheKey, fetchFunction);
      }

      setResearch(prev => ({
        ...prev,
        ...results,
        loading: false,
        lastUpdated: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Research fetch error:', error);
      setResearch(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [searchStrategy, antibiotic, pathogen, topic]);

  // Custom search
  const performCustomSearch = async () => {
    if (!searchQuery.trim()) return;

    setResearch(prev => ({ ...prev, loading: true, error: null }));

    try {
      const results = await pubmedService.searchPubMed(searchQuery, {
        maxResults: 20,
        dateRange: filters.dateRange,
        sortBy: filters.sortBy,
        filters: filters.studyType === 'all' ? [] : [filters.studyType]
      });

      setResearch(prev => ({
        ...prev,
        guidelines: results,
        resistance: { articles: [] },
        pediatric: { articles: [] },
        loading: false,
        lastUpdated: new Date().toISOString()
      }));

    } catch (error) {
      setResearch(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Load research on mount and when props change
  useEffect(() => {
    if (searchStrategy) {
      fetchResearch();
    }
  }, [searchStrategy, fetchResearch]);

  const TabButton = ({ id, label, count = 0, active = false }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span>{label}</span>
      {count > 0 && (
        <span className={`text-xs px-2 py-1 rounded-full ${
          active ? 'bg-blue-200' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const ArticleCard = ({ article, relevanceThreshold = 60 }) => {
    const isHighRelevance = article.relevanceScore >= relevanceThreshold;
    
    return (
      <div className={`bg-white rounded-lg p-4 border-l-4 shadow-sm hover:shadow-md transition-shadow ${
        isHighRelevance ? 'border-l-green-400' : 'border-l-blue-400'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
              {article.title}
            </h4>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{article.publicationDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{article.authors.slice(0, 2).join(', ')}</span>
                {article.authors.length > 2 && <span>et al.</span>}
              </div>
              {isHighRelevance && (
                <div className="flex items-center gap-1 text-green-600">
                  <Award size={12} />
                  <span>High Relevance</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {article.journal}
            </p>
          </div>
          <a
            href={article.pubmedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="View on PubMed"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        
        {article.abstract && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 leading-relaxed">
              {article.abstract.length > 200 
                ? `${article.abstract.substring(0, 200)}...`
                : article.abstract
              }
            </p>
          </div>
        )}
        
        {article.doi && (
          <div className="mt-2 text-xs text-gray-500">
            DOI: <span className="font-mono">{article.doi}</span>
          </div>
        )}
      </div>
    );
  };

  const EmptyState = ({ message, icon: Icon }) => (
    <div className="text-center py-8 text-gray-500">
      <Icon size={48} className="mx-auto mb-3 opacity-50" />
      <p>{message}</p>
    </div>
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'guidelines':
        return research.guidelines.articles || [];
      case 'resistance':
        return research.resistance.articles || [];
      case 'pediatric':
        return research.pediatric.articles || [];
      default:
        return [];
    }
  };

  if (!searchStrategy) {
    return (
      <div className={`bg-white rounded-lg p-6 border border-gray-200 ${className}`}>
        <div className="text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Integration</h3>
          <p className="text-gray-600 mb-4">
            Search PubMed for evidence-based medical literature
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter medical topic, antibiotic, or pathogen..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => e.key === 'Enter' && performCustomSearch()}
              />
              <button
                onClick={performCustomSearch}
                disabled={!searchQuery.trim() || research.loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
            
            <div className="flex gap-2 text-xs">
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="1">Last year</option>
                <option value="3">Last 3 years</option>
                <option value="5">Last 5 years</option>
                <option value="10">Last 10 years</option>
              </select>
              
              <select
                value={filters.studyType}
                onChange={(e) => setFilters(prev => ({ ...prev, studyType: e.target.value }))}
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="all">All studies</option>
                <option value="systematic review">Systematic reviews</option>
                <option value="clinical trial">Clinical trials</option>
                <option value="guideline">Guidelines</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentData = getCurrentData();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen size={20} />
              Research Evidence
            </h3>
            <p className="text-sm text-gray-600">
              {searchStrategy.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {research.lastUpdated && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                <span>
                  Updated {new Date(research.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            )}
            
            <button
              onClick={() => fetchResearch(true)}
              disabled={research.loading}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh research"
            >
              <RefreshCw size={16} className={research.loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <TabButton
            id="guidelines"
            label="Guidelines"
            count={research.guidelines.articles?.length || 0}
            active={activeTab === 'guidelines'}
          />
          <TabButton
            id="resistance"
            label="Resistance"
            count={research.resistance.articles?.length || 0}
            active={activeTab === 'resistance'}
          />
          <TabButton
            id="pediatric"
            label="Pediatric"
            count={research.pediatric.articles?.length || 0}
            active={activeTab === 'pediatric'}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {research.loading && (
          <div className="text-center py-8">
            <RefreshCw size={32} className="mx-auto mb-3 animate-spin text-blue-600" />
            <p className="text-gray-600">Searching medical literature...</p>
          </div>
        )}

        {research.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span className="font-semibold">Research Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{research.error}</p>
          </div>
        )}

        {!research.loading && !research.error && currentData.length === 0 && (
          <EmptyState
            message="No research articles found for this topic"
            icon={BookOpen}
          />
        )}

        {!research.loading && !research.error && currentData.length > 0 && (
          <div className="space-y-4">
            {currentData.map((article, index) => (
              <ArticleCard key={article.pmid || index} article={article} />
            ))}
            
            {currentData.length > 0 && (
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Showing {currentData.length} most relevant articles from PubMed
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchIntegration;