# Codebase Structure and Components

## Component Overview

### Main App Component (`src/App.js` - 84 lines)
- **Purpose**: Orchestrates the entire application
- **State Management**: Active tab, selected condition, search term, mobile menu
- **Key Features**: Tab switching, condition filtering, responsive design integration
- **Dependencies**: All child components, custom hooks, data modules

### Navigation Component (`src/components/Header.js`)
- **Purpose**: Site navigation and mobile menu
- **Features**: Responsive navigation, mobile hamburger menu, accessibility
- **State**: Manages mobile menu visibility
- **Icons**: Uses Lucide React for consistent iconography

### Content Components
1. **HomeTab** (`src/components/HomeTab.js`)
   - Landing page with feature highlights
   - Call-to-action integration
   - Clean, focused responsibility

2. **ConditionsTab** (`src/components/ConditionsTab.js`)
   - Medical conditions browser
   - Real-time search filtering
   - Grid display with responsive design
   - Empty state handling

3. **QuizTab** (`src/components/QuizTab.js`)
   - Complete quiz functionality
   - Progress tracking and scoring
   - Results display with performance analysis
   - Quiz state management

4. **ConditionDetailModal** (`src/components/ConditionDetailModal.js`)
   - Modal for detailed condition information
   - Keyboard navigation (Escape key)
   - Body scroll prevention
   - ARIA attributes for accessibility

## Custom Hooks

### useResponsive (`src/hooks/useResponsive.js`)
- **Purpose**: Centralized responsive design logic
- **Returns**: Boolean indicating mobile vs desktop
- **Usage**: Used across components for responsive behavior

## Data Modules

### Medical Conditions (`src/data/medicalConditions.js`)
- Comprehensive infectious disease data
- Structured format with categories, pathogens, treatments
- Used by ConditionsTab and filtering logic

### Quiz Questions (`src/data/quizQuestions.js`)
- Educational quiz content
- Multiple choice format with explanations
- Used by QuizTab component

## Key Design Patterns
- **Container/Presentational**: App.js manages state, components present UI
- **Single Responsibility**: Each component has one clear purpose
- **Prop Drilling**: Explicit prop passing for clear data flow
- **Responsive Design**: Mobile-first approach with breakpoint logic