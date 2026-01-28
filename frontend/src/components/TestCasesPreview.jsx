import React, { useState } from 'react';
import { IconButton, Tab, Tabs } from '@mui/material';

export default function TestCasesPreview({ testCases, isRunning, actionType, isExpanded, onToggle }) {
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTestIndex(newValue);
  };

  if (!isExpanded) {
    return (
      <div className="test-cases-preview collapsed">
        <IconButton 
          className="btn btn--icon btn--ghost btn-sidebar-toggle"
          onClick={onToggle}
          title="Show test cases"
          type="button"
        >
          ▶
        </IconButton>
      </div>
    );
  }

  const collapseButton = (
    <IconButton 
      className="btn btn--icon btn--ghost btn-sidebar-toggle test-cases-toggle-middle"
      onClick={onToggle}
      title="Hide test cases"
      type="button"
    >
      ◀
    </IconButton>
  );

  if (!testCases || testCases.length === 0) {
    return (
      <div className="test-cases-preview">
        {collapseButton}
        <div className="test-tabs-container">
          <p className="no-results">Loading test cases...</p>
        </div>
      </div>
    );
  }

  const selectedTestCase = testCases[selectedTestIndex];

  return (
    <div className="test-cases-preview">
      {collapseButton}
      <div className="test-tabs-container">
        <div className="test-tabs-header">
          <Tabs
            value={selectedTestIndex}
            onChange={handleTabChange}
            className="test-tabs"
            variant="scrollable"
            scrollButtons={false}
            TabIndicatorProps={{ style: { display: 'none' } }}
            aria-label="Test cases"
          >
            {testCases.map((testCase, index) => (
              <Tab
                key={testCase.id || index}
                className={`test-tab ${index === selectedTestIndex ? 'active' : ''}`}
                label={
                  <span className="test-tab-label">
                    Test {index + 1}
                  </span>
                }
                value={index}
              />
            ))}
          </Tabs>
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
