# Code Style and Conventions

## Naming Conventions
- **Components**: PascalCase (e.g., `Header`, `ConditionsTab`, `ConditionDetailModal`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables/Functions**: camelCase (e.g., `activeTab`, `setActiveTab`, `filteredConditions`)
- **CSS Classes**: Tailwind CSS utility classes with kebab-case

## Component Structure
- **Function Components**: Arrow functions with destructured props
- **Props Documentation**: JSDoc comments with Props: section
- **Single Responsibility**: Each component has one clear purpose
- **Default Exports**: All components use `export default ComponentName`

## Documentation Standards
- **JSDoc Comments**: Comprehensive documentation for all components
- **Props Documentation**: Explicit listing of all props with descriptions
- **Usage Examples**: Included in component documentation
- **Implementation Notes**: Key details about component behavior

## Code Organization
- **Imports**: React imports first, then components, then data/utilities
- **State Management**: useState hooks grouped at component top
- **Prop Destructuring**: Clean destructuring in function parameters
- **Conditional Rendering**: Clear ternary operators for UI logic

## Accessibility Standards
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Tab order and escape key handling
- **Semantic HTML**: Proper use of semantic elements
- **Screen Reader Support**: Alt text and descriptive labels

## React Best Practices
- **Custom Hooks**: Logic extraction for reusability
- **Component Composition**: Building complex UIs from simple components
- **Props vs State**: Clear separation of concerns
- **Performance**: Foundation laid for React.memo and optimization