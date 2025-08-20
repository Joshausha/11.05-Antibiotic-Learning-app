# Tech Stack and Architecture

## Core Technologies
- **React 18.2.0**: Main frontend framework
- **React DOM 18.2.0**: DOM rendering
- **React Scripts 5.0.1**: Build toolchain (Create React App)
- **Lucide React 0.263.1**: Icon library for UI components

## Development Dependencies
- **@testing-library/jest-dom**: DOM testing utilities
- **@testing-library/react**: React component testing
- **@testing-library/user-event**: User interaction testing

## Architecture Pattern
- **Component-based architecture**: 5 focused components with single responsibilities
- **Custom hooks**: Reusable logic extraction (useResponsive)
- **Data separation**: Medical data and quiz data in separate modules
- **Clean state management**: Lifted state pattern with prop drilling

## Project Structure
```
src/
├── components/           # UI components
│   ├── Header.js        # Navigation component
│   ├── HomeTab.js       # Landing page
│   ├── ConditionsTab.js # Medical conditions browser
│   ├── QuizTab.js       # Quiz functionality
│   └── ConditionDetailModal.js # Condition details modal
├── data/                # Data modules
│   ├── medicalConditions.js # Medical conditions data
│   └── quizQuestions.js     # Quiz questions data
├── hooks/               # Custom React hooks
│   └── useResponsive.js # Responsive design logic
├── App.js              # Main application component (84 lines)
└── index.js            # React entry point
```