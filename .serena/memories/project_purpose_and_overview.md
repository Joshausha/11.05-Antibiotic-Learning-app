# Antibiotic Learning App - Project Overview

## Purpose
The Antibiotic Learning App is a React-based educational application designed to help medical professionals and students learn about infectious diseases and antimicrobial therapy. This is specifically targeted at pediatric medicine education.

## Key Features
- **Medical Conditions Browser**: Interactive catalog of infectious diseases with detailed information
- **Quiz System**: Educational quizzes to test knowledge on antimicrobial therapy
- **Pathogen Explorer**: Interactive network visualization with 39 unique pathogens
- **Antibiotic Explorer**: Advanced drug interaction analysis with 43 antibiotics
- **Visualizations Dashboard**: 5 interactive chart types with comprehensive data analysis
- **Progress Tracking**: Personal analytics and learning metrics
- **Responsive Design**: Mobile-friendly interface for learning on any device
- **Search Functionality**: Real-time filtering of medical conditions
- **Accessibility**: WCAG compliant with screen reader support and keyboard navigation

## Current Status
The project has completed the major refactoring effort, transforming from a 635-line monolithic component into a well-structured, maintainable application with 12 organized files. The app is feature-rich with sophisticated functionality but requires test suite stabilization before production deployment.

## Technical Status
- **Architecture**: Near production-ready with advanced React patterns
- **Features**: 85-90% complete with 7/7 tabs functional
- **Tests**: 91.7% pass rate (15 failed, 166 passed) - needs stabilization
- **Bundle Size**: 68.86 kB gzipped (optimal)
- **Known Issues**: useLocalStorage hook tests, React act() warnings in Quiz Tab

## Project Context
This is part of a larger PARA-organized learning system for pediatric medicine, located under "1. Projects/Antibiotic Learning app" in the user's Obsidian vault. The project demonstrates advanced React architecture with Context API, lazy loading, error boundaries, and sophisticated data management.