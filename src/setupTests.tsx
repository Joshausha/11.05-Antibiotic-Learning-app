// @ts-nocheck - Test setup file with complex Jest mocks and global configurations
// Global test setup for antibiotic learning app
import '@testing-library/jest-dom';

// Mock fetch globally for all tests
global.fetch = jest.fn();

// Mock ResizeObserver for chart components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for lazy loading components
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock DOMParser for XML processing in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.DOMParser = class MockDOMParser {
  parseFromString(xmlString: string, contentType: string): any {
    // Comprehensive mock XML document for testing
    const mockDoc = {
      getElementsByTagName: jest.fn().mockImplementation((tagName: string) => {
        if (tagName === 'Id') {
          // Return mock ID nodes for PubMed testing
          const idMatches = xmlString.match(/<Id>(\d+)<\/Id>/g) || [];
          return idMatches.map(match => ({
            textContent: match.replace(/<\/?Id>/g, '')
          }));
        }
        if (tagName === 'parsererror') {
          return []; // No parse errors in mock
        }
        if (tagName === 'PubmedArticle') {
          // Handle PubmedArticle XML structure
          const mockArticle = {
            querySelector: jest.fn().mockImplementation((selector: string) => {
              if (selector === 'MedlineCitation') return {
                querySelector: jest.fn().mockImplementation((subSelector: string) => {
                  switch (subSelector) {
                    case 'PMID':
                      return { textContent: '12345678' };
                    case 'ArticleTitle':
                      return { textContent: 'Test Article Title' };
                    case 'Abstract AbstractText':
                      return { textContent: 'Test abstract content' };
                    case 'Journal Title':
                      return { textContent: 'Test Journal' };
                    default:
                      return null;
                  }
                }),
                querySelectorAll: jest.fn().mockReturnValue([])
              };
              return null;
            })
          };
          return xmlString.includes('<PubmedArticle>') ? [mockArticle] : [];
        }
        return [];
      }),
      querySelector: jest.fn(),
      querySelectorAll: jest.fn().mockReturnValue([])
    };
    return mockDoc;
  }
} as any;

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo for navigation tests
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock localStorage with proper implementation
const mockStore: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn().mockImplementation((key: string) => {
    return mockStore[key] !== undefined ? mockStore[key] : null;
  }),
  setItem: jest.fn().mockImplementation((key: string, value: string) => {
    mockStore[key] = value;
  }),
  removeItem: jest.fn().mockImplementation((key: string) => {
    delete mockStore[key];
  }),
  clear: jest.fn().mockImplementation(() => {
    Object.keys(mockStore).forEach(key => {
      delete mockStore[key];
    });
  }),
  // Expose mockStore for testing
  __mockStore: mockStore
};
global.localStorage = localStorageMock as any;

// Mock window.localStorage for useLocalStorage hook compatibility
Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock as any;


// Mock Chart.js for analytics components
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
    defaults: {
      responsive: true,
      maintainAspectRatio: false,
    }
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  ArcElement: jest.fn(),
}));

// Mock react-chartjs-2 components
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options, ...props }: any) => (
    <div data-testid="line-chart" {...props}>
      Mock Line Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
  Bar: ({ data, options, ...props }: any) => (
    <div data-testid="bar-chart" {...props}>
      Mock Bar Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
  Pie: ({ data, options, ...props }: any) => (
    <div data-testid="pie-chart" {...props}>
      Mock Pie Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
  Doughnut: ({ data, options, ...props }: any) => (
    <div data-testid="doughnut-chart" {...props}>
      Mock Doughnut Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const MockIcon = ({ size = 24, className = '', ...props }: any) => (
    <svg 
      width={size} 
      height={size} 
      className={className}
      data-testid="mock-icon"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );

  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return MockIcon;
      }
      return target[prop];
    }
  });
});

// Note: NorthwesternPieChart component testing handled in dedicated test file

// Console error handler for debugging (removed ReactDOMTestUtils.act suppression)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Allow ReactDOMTestUtils.act warnings to surface so we can fix them
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});