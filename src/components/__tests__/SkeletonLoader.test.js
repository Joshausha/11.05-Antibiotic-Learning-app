/**
 * Tests for SkeletonLoader
 * @description Test coverage for skeleton loading states
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkeletonLoader from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  describe('Type Routing', () => {
    test('renders ConditionCardSkeleton when type is "card"', () => {
      const { container } = render(<SkeletonLoader type="card" />);
      expect(container.querySelector('.card.animate-pulse')).toBeInTheDocument();
      expect(container.querySelector('.skeleton-button')).toBeInTheDocument();
    });

    test('renders PathogenListSkeleton when type is "list"', () => {
      const { container } = render(<SkeletonLoader type="list" />);
      expect(container.querySelectorAll('.flex.items-center.p-3')).toHaveLength(5);
    });

    test('renders QuizSkeleton when type is "quiz"', () => {
      const { container } = render(<SkeletonLoader type="quiz" />);
      expect(container.querySelectorAll('.skeleton.h-12.w-full.rounded-lg')).toHaveLength(4);
    });

    test('renders TableSkeleton when type is "table"', () => {
      const { container } = render(<SkeletonLoader type="table" />);
      expect(container.querySelectorAll('.flex.space-x-4')).toHaveLength(5);
    });

    test('renders ContentSkeleton by default or when type is "content"', () => {
      const { container } = render(<SkeletonLoader type="content" />);
      expect(container.querySelector('.skeleton-title')).toBeInTheDocument();
      expect(container.querySelectorAll('.skeleton-text')).toHaveLength(3);
    });

    test('falls back to ContentSkeleton for invalid type', () => {
      const { container } = render(<SkeletonLoader type="unknown" />);
      expect(container.querySelector('.skeleton-title')).toBeInTheDocument();
    });
  });

  describe('TableSkeleton Props', () => {
    test('renders custom number of rows and columns', () => {
      const { container } = render(<SkeletonLoader type="table" rows={3} columns={2} />);
      // 3 rows
      expect(container.querySelectorAll('.flex.space-x-4')).toHaveLength(3);
      // Check columns in first row
      const firstRow = container.querySelector('.flex.space-x-4');
      expect(firstRow.querySelectorAll('.skeleton')).toHaveLength(2);
    });

    test('renders nothing when rows is 0', () => {
      const { container } = render(<SkeletonLoader type="table" rows={0} />);
      expect(container.querySelectorAll('.flex.space-x-4')).toHaveLength(0);
    });
  });

  describe('ContentSkeleton Props', () => {
    test('renders custom number of lines', () => {
      const { container } = render(<SkeletonLoader type="content" lines={5} />);
      expect(container.querySelectorAll('.skeleton-text')).toHaveLength(5);
    });

    test('hides title when title prop is false', () => {
      const { container } = render(<SkeletonLoader type="content" title={false} />);
      expect(container.querySelector('.skeleton-title')).not.toBeInTheDocument();
    });
  });

  describe('Animation Classes', () => {
    test('applies animate-pulse class', () => {
      const { container } = render(<SkeletonLoader type="content" />);
      expect(container.firstChild).toHaveClass('animate-pulse');
    });
  });
});
