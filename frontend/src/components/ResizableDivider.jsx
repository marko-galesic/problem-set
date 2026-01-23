import React, { useRef, useEffect, useState } from 'react';

export default function ResizableDivider({ onResize, initialPosition = 50, orientation = 'horizontal' }) {
  const [isDragging, setIsDragging] = useState(false);
  const dividerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const onResizeRef = useRef(onResize);
  
  // Keep the ref updated with the latest callback
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    // Load saved position from localStorage on mount
    const storageKey = orientation === 'vertical' 
      ? 'parser_vertical_divider_position'
      : 'parser_divider_position';
    const savedPosition = localStorage.getItem(storageKey);
    if (savedPosition) {
      const position = parseFloat(savedPosition);
      if (!isNaN(position)) {
        const minPos = orientation === 'vertical' ? 20 : 20;
        const maxPos = orientation === 'vertical' ? 80 : 80;
        if (position >= minPos && position <= maxPos) {
          onResizeRef.current(position);
        }
      }
    }
  }, [orientation]); // Only run on mount

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e) {
      if (!isDraggingRef.current) {
        return;
      }
      
      const container = dividerRef.current?.parentElement;
      if (!container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      let newPosition;
      
      if (orientation === 'vertical') {
        // Vertical: calculate based on Y position (top to bottom)
        // Calculate as percentage of container height
        // Note: verticalDividerPosition represents the test-cases-section height percentage
        // So if divider is at Y% from top, test-cases-section is (100 - Y)%
        const relativeY = e.clientY - containerRect.top;
        if (containerRect.height === 0) {
          return;
        }
        // Calculate position from top, then convert to test-cases-section height percentage
        const positionFromTop = (relativeY / containerRect.height) * 100;
        newPosition = 100 - positionFromTop;
      } else {
        // Horizontal: calculate based on X position (left to right)
        const relativeX = e.clientX - containerRect.left;
        if (containerRect.width === 0) {
          return;
        }
        newPosition = (relativeX / containerRect.width) * 100;
      }
      
      // Constrain between 20% and 80%
      const constrainedPosition = Math.max(20, Math.min(80, newPosition));
      onResizeRef.current(constrainedPosition);
    }

    function handleMouseUp() {
      isDraggingRef.current = false;
      setIsDragging(false);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, orientation]);

  useEffect(() => {
    if (!isDragging) {
      document.body.classList.remove('is-resizing');
      return;
    }

    document.body.classList.add('is-resizing');
    return () => {
      document.body.classList.remove('is-resizing');
    };
  }, [isDragging]);

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
  }

  return (
    <div
      ref={dividerRef}
      className={`resizable-divider resizable-divider-${orientation} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      style={{ touchAction: 'none', cursor: orientation === 'vertical' ? 'row-resize' : 'col-resize' }}
    >
      <div className="divider-handle" style={{ pointerEvents: 'none' }}></div>
    </div>
  );
}
