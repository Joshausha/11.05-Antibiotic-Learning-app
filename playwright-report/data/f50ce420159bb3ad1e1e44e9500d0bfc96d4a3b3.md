# Page snapshot

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- banner:
  - text: MedLearn
  - navigation "Main navigation":
    - button "Navigate to Learn": Learn
    - button "Navigate to Quiz": Quiz
    - button "Navigate to Analytics": Analytics
    - button "Navigate to Visualizations": Visualizations
    - button "Navigate to Reference": Reference
    - button "Navigate to Pathogens": Pathogens
    - button "Navigate to Antibiotics": Antibiotics
- main:
  - heading "Application Error" [level=1]
  - heading "Error Details:" [level=2]
  - paragraph: "TypeError: elements.map is not a function"
  - heading "Component Stack:" [level=3]
  - text: at VisualizationsTab (http://localhost:3000/static/js/bundle.js:83376:3) at ErrorBoundary (http://localhost:3000/static/js/bundle.js:73000:5) at main at div at ErrorBoundary (http://localhost:3000/static/js/bundle.js:73000:5) at AppContent (http://localhost:3000/static/js/bundle.js:64517:74) at ErrorBoundary (http://localhost:3000/static/js/bundle.js:73000:5) at AppProvider (http://localhost:3000/static/js/bundle.js:86673:3) at App
  - button "Reload Page"
```