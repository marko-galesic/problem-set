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
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:29',message:'handleMouseMove called',data:{isDraggingRef:isDraggingRef.current,isDraggingState:isDragging,orientation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (!isDraggingRef.current) {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:31',message:'Early return - isDraggingRef is false',data:{isDraggingRef:isDraggingRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return;
      }
      
      const container = dividerRef.current?.parentElement;
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:35',message:'Container check',data:{containerExists:!!container,containerClassName:container?.className,dividerRefExists:!!dividerRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      if (!container) {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:37',message:'No container found - early return',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:48',message:'Vertical drag calculation',data:{relativeY,containerHeight:containerRect.height,containerRect,clientY:e.clientY,containerTop:containerRect.top},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        if (containerRect.height === 0) {
          // #region agent log
          fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:49',message:'Container height is 0 - early return',data:{containerRect},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
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
      // #region agent log
      const dividerRect = dividerRef.current?.getBoundingClientRect();
      const editorSectionRect = container.querySelector('.editor-section')?.getBoundingClientRect();
      const testCasesSectionRect = container.querySelector('.test-cases-section')?.getBoundingClientRect();
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:66',message:'Calling onResize callback with visual positions',data:{constrainedPosition,newPosition,dividerRect,editorSectionRect,testCasesSectionRect,containerRect,clientY:e.clientY},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      onResizeRef.current(constrainedPosition);
      // #region agent log
      // Log positions after state update (use setTimeout to catch next render)
      setTimeout(() => {
        const dividerRectAfter = dividerRef.current?.getBoundingClientRect();
        const editorSectionRectAfter = container.querySelector('.editor-section')?.getBoundingClientRect();
        const testCasesSectionRectAfter = container.querySelector('.test-cases-section')?.getBoundingClientRect();
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:75',message:'Visual positions after onResize callback',data:{constrainedPosition,dividerRectAfter,editorSectionRectAfter,testCasesSectionRectAfter},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H'})}).catch(()=>{});
      }, 0);
      // #endregion
    }

    function handleMouseUp() {
      isDraggingRef.current = false;
      setIsDragging(false);
    }

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:75',message:'Attaching event listeners',data:{isDragging,orientation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:79',message:'Cleaning up event listeners',data:{isDragging},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, orientation]);

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:84',message:'handleMouseDown called',data:{orientation,dividerExists:!!dividerRef.current,dividerRect:dividerRef.current?.getBoundingClientRect(),parentElement:!!dividerRef.current?.parentElement},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:88',message:'Setting isDraggingRef to true',data:{before:isDraggingRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    isDraggingRef.current = true;
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:90',message:'After setting isDraggingRef',data:{after:isDraggingRef.current,isDraggingState:isDragging},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    setIsDragging(true);
  }

  // #region agent log
  useEffect(() => {
    if (dividerRef.current) {
      const rect = dividerRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(dividerRef.current);
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ResizableDivider.jsx:92',message:'Divider element mounted/updated',data:{orientation,rect,computedStyle:{zIndex:computedStyle.zIndex,pointerEvents:computedStyle.pointerEvents,display:computedStyle.display,visibility:computedStyle.visibility,position:computedStyle.position},parentElement:!!dividerRef.current?.parentElement,parentClassName:dividerRef.current?.parentElement?.className},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }
  }, [orientation]);
  // #endregion
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
