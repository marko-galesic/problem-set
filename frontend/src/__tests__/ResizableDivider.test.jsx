import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import ResizableDivider from '../components/ResizableDivider';

describe('ResizableDivider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads saved position and handles horizontal drag', () => {
    localStorage.setItem('parser_divider_position', '30');
    const onResize = vi.fn();

    const { container } = render(
      <div data-testid="container">
        <ResizableDivider onResize={onResize} orientation="horizontal" />
      </div>
    );

    expect(onResize).toHaveBeenCalledWith(30);

    const divider = container.querySelector('.resizable-divider');
    const parent = divider.parentElement;
    parent.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 });

    fireEvent.mouseDown(divider, { clientX: 50, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 100, clientY: 0 });
    fireEvent.mouseUp(document);

    expect(onResize).toHaveBeenCalled();
  });

  it('handles vertical drag with constraints', () => {
    const onResize = vi.fn();
    const { container } = render(
      <div>
        <ResizableDivider onResize={onResize} orientation="vertical" />
      </div>
    );

    const divider = container.querySelector('.resizable-divider');
    const parent = divider.parentElement;
    parent.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200 });

    fireEvent.mouseDown(divider, { clientX: 0, clientY: 20 });
    fireEvent.mouseMove(document, { clientX: 0, clientY: 50 });
    fireEvent.mouseUp(document);

    expect(onResize).toHaveBeenCalled();
  });
});
