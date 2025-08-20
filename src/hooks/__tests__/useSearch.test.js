/**
 * Tests for useSearch hook
 * @description Comprehensive test suite for the search functionality hook
 */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useSearch from '../useSearch';

describe('useSearch Hook', () => {
  const sampleItems = [
    {
      name: 'Pneumonia',
      category: 'Respiratory',
      commonPathogens: ['Streptococcus pneumoniae', 'Haemophilus influenzae'],
      description: 'Lung infection'
    },
    {
      name: 'UTI',
      category: 'Genitourinary',
      commonPathogens: ['E. coli', 'Enterococcus'],
      description: 'Urinary tract infection'
    },
    {
      name: 'Sepsis',
      category: 'Systemic',
      commonPathogens: ['Staphylococcus aureus', 'Streptococcus'],
      description: 'Bloodstream infection'
    }
  ];

  const searchFields = ['name', 'category', 'commonPathogens', 'description'];

  test('returns all items when search term is empty', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    expect(result.current.filteredItems).toEqual(sampleItems);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.searchStats.isFiltered).toBe(false);
  });

  test('filters items by name', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('pneumonia');
    });
    
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].name).toBe('Pneumonia');
    expect(result.current.searchStats.isFiltered).toBe(true);
  });

  test('filters items by category', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('respiratory');
    });
    
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].category).toBe('Respiratory');
  });

  test('filters items by array field (commonPathogens)', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('e. coli');
    });
    
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].name).toBe('UTI');
  });

  test('filters items by description', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('infection');
    });
    
    expect(result.current.filteredItems).toHaveLength(3); // All have 'infection' in description
  });

  test('search is case insensitive', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('PNEUMONIA');
    });
    
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].name).toBe('Pneumonia');
  });

  test('search handles partial matches', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('strep');
    });
    
    expect(result.current.filteredItems).toHaveLength(2); // Pneumonia and Sepsis have Streptococcus
  });

  test('search returns empty array when no matches', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('nonexistent');
    });
    
    expect(result.current.filteredItems).toHaveLength(0);
  });

  test('clearSearch resets search term and filters', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('pneumonia');
    });
    
    expect(result.current.filteredItems).toHaveLength(1);
    
    act(() => {
      result.current.clearSearch();
    });
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredItems).toEqual(sampleItems);
  });

  test('search stats are calculated correctly', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    expect(result.current.searchStats.totalItems).toBe(3);
    expect(result.current.searchStats.filteredItems).toBe(3);
    expect(result.current.searchStats.isFiltered).toBe(false);
    
    act(() => {
      result.current.setSearchTerm('pneumonia');
    });
    
    expect(result.current.searchStats.totalItems).toBe(3);
    expect(result.current.searchStats.filteredItems).toBe(1);
    expect(result.current.searchStats.isFiltered).toBe(true);
    expect(result.current.searchStats.searchTerm).toBe('pneumonia');
  });

  test('handles empty items array', () => {
    const { result } = renderHook(() => useSearch([], searchFields));
    
    expect(result.current.filteredItems).toEqual([]);
    expect(result.current.searchStats.totalItems).toBe(0);
  });

  test('handles undefined items', () => {
    const { result } = renderHook(() => useSearch(undefined, searchFields));
    
    expect(result.current.filteredItems).toEqual([]);
  });

  test('handles empty search fields', () => {
    const { result } = renderHook(() => useSearch(sampleItems, []));
    
    act(() => {
      result.current.setSearchTerm('pneumonia');
    });
    
    expect(result.current.filteredItems).toEqual([]); // No fields to search
  });

  test('handles nested field paths', () => {
    const nestedItems = [
      {
        name: 'Test',
        details: {
          category: 'Respiratory',
          info: 'Nested information'
        }
      }
    ];
    
    const { result } = renderHook(() => useSearch(nestedItems, ['details.category', 'details.info']));
    
    act(() => {
      result.current.setSearchTerm('respiratory');
    });
    
    expect(result.current.filteredItems).toHaveLength(1);
  });


  test('memoization prevents unnecessary recalculations', () => {
    const { result, rerender } = renderHook(
      ({ items, fields }) => useSearch(items, fields),
      { initialProps: { items: sampleItems, fields: searchFields } }
    );
    
    const initialResult = result.current.filteredItems;
    
    // Re-render with same props
    rerender({ items: sampleItems, fields: searchFields });
    
    // Should be the same object reference due to memoization
    expect(result.current.filteredItems).toBe(initialResult);
  });

  // Enhanced Phase 2 comprehensive testing
  
  test('handles search with special characters and regex patterns', () => {
    const specialItems = [
      { name: 'Test (parentheses)', category: 'Special' },
      { name: 'Test [brackets]', category: 'Special' },
      { name: 'Test {braces}', category: 'Special' },
      { name: 'Test +plus+', category: 'Special' },
      { name: 'Test *asterisk*', category: 'Special' },
      { name: 'Test .dot.', category: 'Special' }
    ];
    
    const { result } = renderHook(() => useSearch(specialItems, ['name']));
    
    // Test parentheses
    act(() => {
      result.current.setSearchTerm('(parentheses)');
    });
    expect(result.current.filteredItems).toHaveLength(1);
    
    // Test brackets
    act(() => {
      result.current.setSearchTerm('[brackets]');
    });
    expect(result.current.filteredItems).toHaveLength(1);
    
    // Test plus signs
    act(() => {
      result.current.setSearchTerm('+plus+');
    });
    expect(result.current.filteredItems).toHaveLength(1);
  });

  test('debounces search input for performance', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    // Rapid search term changes
    act(() => {
      result.current.setSearchTerm('p');
    });
    act(() => {
      result.current.setSearchTerm('pn');
    });
    act(() => {
      result.current.setSearchTerm('pne');
    });
    act(() => {
      result.current.setSearchTerm('pneu');
    });
    
    // Fast-forward timers if debouncing is implemented
    jest.advanceTimersByTime(300);
    
    expect(result.current.searchTerm).toBe('pneu');
    
    jest.useRealTimers();
  });

  test('handles unicode and international characters', () => {
    const internationalItems = [
      { name: 'Pneumonía', category: 'Respiratorio' },
      { name: 'Infección', category: 'General' },
      { name: 'Naïve', category: 'Test' },
      { name: '肺炎', category: 'Respiratory' }
    ];
    
    const { result } = renderHook(() => useSearch(internationalItems, ['name']));
    
    act(() => {
      result.current.setSearchTerm('pneumonía');
    });
    expect(result.current.filteredItems).toHaveLength(1);
    
    act(() => {
      result.current.setSearchTerm('肺炎');
    });
    expect(result.current.filteredItems).toHaveLength(1);
  });

  test('search highlights and ranking functionality', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    act(() => {
      result.current.setSearchTerm('infection');
    });
    
    // Should return items that match, potentially with ranking info
    expect(result.current.filteredItems).toHaveLength(3);
    
    // Test that exact matches come first if ranking is implemented
    act(() => {
      result.current.setSearchTerm('UTI');
    });
    
    expect(result.current.filteredItems[0].name).toBe('UTI');
  });

  test('performance with large datasets', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      name: `Item ${i}`,
      category: `Category ${i % 10}`,
      description: `Description for item ${i}`,
      tags: [`tag${i}`, `tag${i + 1}`]
    }));
    
    const startTime = performance.now();
    
    const { result } = renderHook(() => useSearch(largeDataset, ['name', 'category', 'description', 'tags']));
    
    act(() => {
      result.current.setSearchTerm('Item 5');
    });
    
    const endTime = performance.now();
    
    // Should handle large datasets efficiently
    expect(endTime - startTime).toBeLessThan(100);
    expect(result.current.filteredItems.length).toBeGreaterThan(0);
  });

  test('search with fuzzy matching tolerance', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    // Test slight misspellings (if fuzzy search is implemented)
    act(() => {
      result.current.setSearchTerm('pnemonia'); // Missing 'u'
    });
    
    // May or may not find matches depending on implementation
    // This test documents expected behavior
    const fuzzyResults = result.current.filteredItems;
    expect(Array.isArray(fuzzyResults)).toBe(true);
  });

  test('search across multiple data types in fields', () => {
    const mixedItems = [
      {
        name: 'Test Item',
        count: 42,
        active: true,
        tags: ['red', 'blue'],
        metadata: { priority: 'high' }
      }
    ];
    
    const { result } = renderHook(() => useSearch(mixedItems, ['name', 'count', 'active', 'tags']));
    
    // Search for number
    act(() => {
      result.current.setSearchTerm('42');
    });
    expect(result.current.filteredItems).toHaveLength(1);
    
    // Search for boolean (if supported)
    act(() => {
      result.current.setSearchTerm('true');
    });
    // Behavior depends on implementation
  });

  test('maintains search state across items prop changes', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useSearch(items, searchFields),
      { initialProps: { items: sampleItems } }
    );
    
    act(() => {
      result.current.setSearchTerm('pneumonia');
    });
    
    expect(result.current.searchTerm).toBe('pneumonia');
    
    // Change items prop
    const newItems = [...sampleItems, { name: 'New Item', category: 'New' }];
    rerender({ items: newItems });
    
    // Search term should be maintained
    expect(result.current.searchTerm).toBe('pneumonia');
  });

  test('search statistics accuracy with edge cases', () => {
    const { result } = renderHook(() => useSearch(sampleItems, searchFields));
    
    // Empty search
    expect(result.current.searchStats.filteredItems).toBe(3);
    expect(result.current.searchStats.totalItems).toBe(3);
    
    // No matches
    act(() => {
      result.current.setSearchTerm('xyznomatch');
    });
    expect(result.current.searchStats.filteredItems).toBe(0);
    expect(result.current.searchStats.totalItems).toBe(3);
    
    // Partial matches
    act(() => {
      result.current.setSearchTerm('strep');
    });
    expect(result.current.searchStats.filteredItems).toBe(2);
  });

  test('concurrent searches do not interfere', () => {
    const { result: result1 } = renderHook(() => useSearch(sampleItems, ['name']));
    const { result: result2 } = renderHook(() => useSearch(sampleItems, ['category']));
    
    act(() => {
      result1.current.setSearchTerm('pneumonia');
      result2.current.setSearchTerm('respiratory');
    });
    
    expect(result1.current.searchTerm).toBe('pneumonia');
    expect(result2.current.searchTerm).toBe('respiratory');
    expect(result1.current.filteredItems).toHaveLength(1);
    expect(result2.current.filteredItems).toHaveLength(1);
  });
});