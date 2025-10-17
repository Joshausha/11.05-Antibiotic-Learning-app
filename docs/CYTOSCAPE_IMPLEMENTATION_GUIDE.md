# Cytoscape: Developer Implementation Guide

**Purpose**: This guide provides detailed strategies and code examples for implementing the logic required for the scaffolded Cytoscape components.

---

### **1. Implementing Filter Logic**

The goal is to filter the visible nodes in the graph based on user selections. We will manage the filter state and use a `useEffect` hook to apply the changes to the Cytoscape instance.

**File to Modify**: `src/components/PathogenNetworkVisualizationCytoscape.js`

**Strategy**:

1.  **Create a Filter State**: Use a single state object to hold the current value of all filters.
2.  **Build Filter UI**: Create dropdowns or input fields that update this state object.
3.  **Apply Filters with a `useEffect`**: When the filter state changes, this effect will run. It will iterate through all nodes, showing or hiding them based on whether they match the current filter criteria.

**Code Example**:

```javascript
// Inside PathogenNetworkVisualizationCytoscape.js

// 1. Add state for filters and a reference to the Cytoscape instance
const [cy, setCy] = useState(null);
const [filters, setFilters] = useState({
  gramStain: 'all',
  severity: 'all',
});

// Callback to get the cy instance from the component
useEffect(() => {
  if (cy) {
    // 2. Apply filters whenever the state changes
    const { gramStain, severity } = filters;
    cy.elements().forEach(ele => {
      if (ele.isNode()) {
        const nodeData = ele.data();
        const gramMatch = gramStain === 'all' || nodeData.gramStain === gramStain;
        const severityMatch = severity === 'all' || nodeData.severity === severity;

        if (gramMatch && severityMatch) {
          ele.style('display', 'element');
        } else {
          ele.style('display', 'none');
        }
      }
    });
  }
}, [filters, cy]);

const handleFilterChange = (filterName, value) => {
  setFilters(prev => ({ ...prev, [filterName]: value }));
};

// In the return() JSX:
// ...
// 3. Update the UI to use the state and handler
<select onChange={(e) => handleFilterChange('gramStain', e.target.value)}>
  <option value="all">All Gram Stains</option>
  <option value="positive">Gram-Positive</option>
  <option value="negative">Gram-Negative</option>
</select>

// ...
// 4. Get the cy instance from the component
<CytoscapeComponent
  cy={(_cy) => setCy(_cy)}
  // ... other props
/>
```

---

### **2. Implementing Interaction Logic (Event Handling)**

The goal is to respond to user actions like clicking or hovering on a node.

**File to Modify**: `src/components/PathogenNetworkVisualizationCytoscape.js`

**Strategy**:

1.  **Create State for Selected Node**: Keep track of the currently selected pathogen to display its details.
2.  **Use `cy.on()`**: Attach event listeners for `tap` (click) and `mouseover` directly to the Cytoscape instance. These listeners will update the component's state.

**Code Example**:

```javascript
// Inside PathogenNetworkVisualizationCytoscape.js

// 1. Add state for the selected pathogen
const [selectedPathogen, setSelectedPathogen] = useState(null);

useEffect(() => {
  if (cy) {
    // 2. Clear previous listeners to avoid duplicates
    cy.removeAllListeners();

    // 3. Attach new listeners
    cy.on('tap', 'node', (event) => {
      const nodeData = event.target.data();
      console.log('Node Tapped:', nodeData);
      setSelectedPathogen(nodeData);
    });

    cy.on('mouseover', 'node', (event) => {
      event.target.style('border-color', '#000'); // Highlight on hover
    });

    cy.on('mouseout', 'node', (event) => {
      event.target.style('border-color', '#333'); // Revert on mouse out
    });
  }
}, [cy]); // Re-run only when the cy instance is available

// In the return() JSX, you can now display the details:
<div className="w-full h-full flex">
  <div className="flex-grow">
    <CytoscapeComponent /* ...props... */ />
  </div>
  {selectedPathogen && (
    <div className="w-1/3 p-4 border-l">
      <h4 className="font-bold">{selectedPathogen.label}</h4>
      <p>{selectedPathogen.description}</p>
      {/* Add more details here */}
    </div>
  )}
</div>
```

---

### **3. Implementing Tests**

The goal is to fill in the placeholder tests with meaningful assertions.

**File to Modify**: `src/components/__tests__/PathogenNetworkVisualizationCytoscape.test.js`

**Strategy**:

1.  **Mock Data**: Import and use mock data to ensure tests are predictable.
2.  **Test Rendering**: Check that initial elements, like the layout dropdown, are rendered correctly.
3.  **Test Interactions**: Use `fireEvent` to simulate user actions (e.g., changing a filter) and assert that the component behaves as expected. Since we can't easily inspect the Cytoscape canvas, we test the *effects* of the interaction (e.g., does a details panel appear?).

**Code Example**:

```javascript
// Inside PathogenNetworkVisualizationCytoscape.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import PathogenNetworkVisualizationCytoscape from '../PathogenNetworkVisualizationCytoscape';

// Mock the data import
jest.mock('../../data/PathogenRelationshipData', () => ({
  nodes: [
    { data: { id: 'Staph', label: 'Staph aureus', gramStain: 'positive', severity: 'high' } },
    { data: { id: 'Ecoli', label: 'E. coli', gramStain: 'negative', severity: 'medium' } },
  ],
  edges: [],
}));

describe('PathogenNetworkVisualizationCytoscape', () => {
  
  test('renders the layout selector with 5 options', () => {
    render(<PathogenNetworkVisualizationCytoscape />);
    // Check that the layout dropdown is present
    const layoutSelect = screen.getByLabelText('Layout:');
    expect(layoutSelect).toBeInTheDocument();
    // Check that it has the correct number of options
    expect(layoutSelect.children.length).toBe(5);
  });

  test('filters by Gram status when dropdown is changed', () => {
    render(<PathogenNetworkVisualizationCytoscape />);
    
    // Initially, no details panel should be visible
    expect(screen.queryByText('E. coli')).not.toBeInTheDocument();

    // Simulate changing the gram stain filter
    const gramFilter = screen.getByLabelText('Gram Stain:'); // Assuming you add this label
    fireEvent.change(gramFilter, { target: { value: 'negative' } });

    // This is a simplified test. A real test would require checking if the
    // Cytoscape instance was updated. For UI testing, we can check for effects.
    // For example, if filtering and then clicking a node shows details:
    
    // (This part requires the interaction logic from above to be implemented)
    // fireEvent.click(screen.getByText('E. coli')); // This is a simplification
    // expect(screen.getByText('Leading cause of urinary tract infections')).toBeInTheDocument();
    
    // A todo to remind developers to write a more robust test
    test.todo('Assert that the Cytoscape instance receives the correct filter commands');
  });

});
```
