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
global.DOMParser = class MockDOMParser {
  parseFromString(xmlString, contentType) {
    // Comprehensive mock XML document for testing
    const mockDoc = {
      getElementsByTagName: jest.fn().mockImplementation((tagName) => {
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
            querySelector: jest.fn().mockImplementation(selector => {
              if (selector === 'MedlineCitation') return {
                querySelector: jest.fn().mockImplementation(subSelector => {
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
};

// Mock window.matchMedia for responsive components and clinical accessibility features
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    // Handle all media queries that the Northwestern Animations system uses
    let matches = false;
    
    if (query.includes('prefers-reduced-motion')) {
      matches = false; // Default to motion enabled for testing
    } else if (query.includes('prefers-contrast: high')) {
      matches = false; // Default to normal contrast for testing
    } else if (query.includes('max-width') || query.includes('min-width')) {
      matches = true; // Default to desktop size for testing
    }
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  }),
});

// Also ensure global.matchMedia is available for non-browser contexts
global.matchMedia = window.matchMedia;

// Mock window.scrollTo for navigation tests
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock localStorage with proper implementation
const mockStore = {};
const localStorageMock = {
  getItem: jest.fn().mockImplementation((key) => {
    return mockStore[key] !== undefined ? mockStore[key] : null;
  }),
  setItem: jest.fn().mockImplementation((key, value) => {
    mockStore[key] = value;
  }),
  removeItem: jest.fn().mockImplementation((key) => {
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
global.localStorage = localStorageMock;

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
global.sessionStorage = sessionStorageMock;


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
  Line: ({ data, options, ...props }) => (
    <div data-testid="line-chart" {...props}>
      Mock Line Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
  Bar: ({ data, options, ...props }) => (
    <div data-testid="bar-chart" {...props}>
      Mock Bar Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
  Pie: ({ data, options, ...props }) => (
    <div data-testid="pie-chart" {...props}>
      Mock Pie Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
  Doughnut: ({ data, options, ...props }) => (
    <div data-testid="doughnut-chart" {...props}>
      Mock Doughnut Chart: {data?.datasets?.[0]?.label || 'Chart'}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const MockIcon = ({ size = 24, className = '', ...props }) => (
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

// Console error handler for debugging
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Log all console errors during tests for debugging
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});