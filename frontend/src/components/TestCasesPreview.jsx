import React, { useState } from 'react';

export default function TestCasesPreview({ testCases, isRunning, actionType, isExpanded, onToggle }) {
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);

  if (!isExpanded) {
    return (
      <div className="test-cases-preview collapsed">
        <button 
          className="btn-sidebar-toggle"
          onClick={onToggle}
          title="Show test cases"
        >
          ▶
        </button>
      </div>
    );
  }

  if (!testCases || testCases.length === 0) {
    return (
      <div className="test-cases-preview">
        <div className="test-tabs-container">
          <div className="test-tabs-header">
            <div className="test-tabs-spacer"></div>
            <button 
              className="btn-sidebar-toggle"
              onClick={onToggle}
              title="Hide test cases"
            >
              ◀
            </button>
          </div>
          <p className="no-results">Loading test cases...</p>
        </div>
      </div>
    );
  }

  const selectedTestCase = testCases[selectedTestIndex];

  return (
    <div className="test-cases-preview">
      <div className="test-tabs-container">
        <div className="test-tabs-header">
          <div className="test-tabs">
            {testCases.map((testCase, index) => (
              <button
                key={testCase.id || index}
                className={`test-tab ${index === selectedTestIndex ? 'active' : ''}`}
                onClick={() => setSelectedTestIndex(index)}
              >
                <span className="test-tab-label">
                  Test {index + 1}: {testCase.name}
                </span>
              </button>
            ))}
          </div>
          <button 
            className="btn-sidebar-toggle"
            onClick={onToggle}
            title="Hide test cases"
          >
            ◀
          </button>
        </div>

        <div className="test-case-content">
          <div className="test-case-header">
            <div className="test-case-left">
              <span className="test-name">
                Test {selectedTestIndex + 1}: {selectedTestCase.name}
              </span>
              {isRunning && (
                <span className="test-case-preview-status running" style={{ marginLeft: '10px' }}>
                  <span className="spinner"></span> Running...
                </span>
              )}
            </div>
          </div>

          <div className="test-details">
            <div className="test-input">
              <strong>Input:</strong>
              <pre>{selectedTestCase.input}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
