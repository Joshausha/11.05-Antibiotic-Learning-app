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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock DOMParser for XML parsing in services
global.DOMParser = jest.fn().mockImplementation(() => ({
  parseFromString: jest.fn().mockImplementation((xmlString, mimeType) => {
    // Create a minimal mock XML document
    const mockDoc = {
      getElementsByTagName: jest.fn().mockReturnValue([]),
      querySelector: jest.fn().mockReturnValue(null),
      querySelectorAll: jest.fn().mockReturnValue([])
    };

    // Handle specific XML patterns for PubMed service
    if (xmlString.includes('<Id>')) {
      const ids = xmlString.match(/<Id>(\d+)<\/Id>/g) || [];
      const mockNodes = ids.map(id => ({
        textContent: id.replace(/<\/?Id>/g, '')
      }));
      mockDoc.getElementsByTagName.mockImplementation(tagName => {
        if (tagName === 'Id') return mockNodes;
        return [];
      });
    }

    if (xmlString.includes('<PubmedArticle>')) {
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
      
      mockDoc.getElementsByTagName.mockImplementation(tagName => {
        if (tagName === 'PubmedArticle') return [mockArticle];
        return [];
      });
    }

    return mockDoc;
  })
}));

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

// Suppress console warnings for cleaner test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOMTestUtils.act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});