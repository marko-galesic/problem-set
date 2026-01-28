import React, { useState } from 'react';

export default function TestResults({
  results,
  totalTime,
  avgTime,
  isExpanded,
  onToggle,
  actionType,
  onUseTestCase,
  baseRunTestIds = [],
  extraRunTestIds = []
}) {
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);

  if (!results || results.length === 0) {
    return null;
  }

  if (!isExpanded) {
    return (
      <div className="test-results collapsed">
        <button 
          className="btn btn--icon btn--ghost btn-sidebar-toggle"
          onClick={onToggle}
          title="Show test results"
          type="button"
        >
          ▶
        </button>
      </div>
    );
  }

  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;
  const selectedResult = results[selectedTestIndex];
  const allowUseTestCase = actionType === 'submit' && !allPassed && typeof onUseTestCase === 'function';
  const selectedTestId = selectedResult?.testCase?.id;
  const hasSelectedId = selectedTestId !== null && selectedTestId !== undefined;
  const inBaseRun = hasSelectedId && baseRunTestIds.includes(selectedTestId);
  const inExtraRun = hasSelectedId && extraRunTestIds.includes(selectedTestId);
  const isAlreadyInRun = inBaseRun || inExtraRun;
  const showUseTestCase = allowUseTestCase && hasSelectedId;
  const useTestCaseLabel = isAlreadyInRun
    ? (inBaseRun ? 'Already in Run' : 'Added to Run')
    : 'Use this test case';

  return (
    <div className="test-results">
      <div className="results-header">
        <h2>Test Results</h2>
        <div className="results-summary">
          <span className={`status ${allPassed ? 'passed' : 'failed'}`}>
            {passedCount} / {results.length} tests passed
          </span>
          {totalTime && (
            <span className="execution-time">
              Total time: {totalTime}ms
            </span>
          )}
          {avgTime && (
            <span className="avg-time">
              Avg time: {avgTime}ms
            </span>
          )}
          <button 
            className="btn btn--icon btn--ghost btn-sidebar-toggle"
            onClick={onToggle}
            title="Hide test results"
            type="button"
          >
            ◀
          </button>
        </div>
      </div>

      <div className="test-tabs-container">
        <div className="test-tabs">
          {results.map((result, index) => (
            <button
              key={index}
              className={`test-tab ${result.passed ? 'passed' : 'failed'} ${index === selectedTestIndex ? 'active' : ''}`}
              onClick={() => setSelectedTestIndex(index)}
              type="button"
            >
              <span className="test-tab-icon">
                {result.passed ? '✓' : '✗'}
              </span>
              <span className="test-tab-label">
                Test {index + 1}: {result.testCase.name}
              </span>
            </button>
          ))}
        </div>

        <div className={`test-case-content ${selectedResult.passed ? 'passed' : 'failed'}`}>
          <div className="test-case-header">
            <div className="test-case-left">
              <span className="test-status-icon">
                {selectedResult.passed ? '✓' : '✗'}
              </span>
              <span className="test-name">
                Test {selectedTestIndex + 1}: {selectedResult.testCase.name}
              </span>
            </div>
            <div className="test-case-right">
              {selectedResult.executionTime && (
                <span className="test-time">
                  {selectedResult.executionTime}ms
                </span>
              )}
              {showUseTestCase && (
                <button
                  className={`btn btn--xs btn-use-test-case${isAlreadyInRun ? ' added' : ''}`}
                  onClick={() => onUseTestCase(selectedResult.testCase)}
                  disabled={isAlreadyInRun}
                  type="button"
                >
                  {useTestCaseLabel}
                </button>
              )}
            </div>
          </div>

          <div className="test-details">
            <div className="test-input">
              <strong>Input:</strong>
              <pre>{selectedResult.testCase.input}</pre>
            </div>
            
            {selectedResult.stdout && (
              <div className="test-stdout">
                <strong>Stdout:</strong>
                <pre className="stdout-output">{selectedResult.stdout}</pre>
              </div>
            )}
            
            {selectedResult.error && (
              <div className="test-error">
                <strong>Error:</strong>
                <pre className="error-output">{selectedResult.error}</pre>
              </div>
            )}
            
            <div className="test-comparison">
              <div className="comparison-row">
                <div className="comparison-item">
                  <strong>Expected:</strong>
                  <pre className="expected">
                    {selectedResult.expected !== null && selectedResult.expected !== undefined 
                      ? selectedResult.expected 
                      : '(not available - output parsing failed)'}
                  </pre>
                </div>
                <div className="comparison-item">
                  <strong>Actual:</strong>
                  <pre className={`actual ${selectedResult.passed ? 'passed' : ''}`}>
                    {selectedResult.actual !== null && selectedResult.actual !== undefined 
                      ? selectedResult.actual 
                      : '(not available - output parsing failed)'}
                  </pre>
                </div>
              </div>
              {(!selectedResult.passed || selectedResult.expected === null || selectedResult.actual === null) && (
                <p className="validation-message">
                  {selectedResult.expected === null || selectedResult.actual === null 
                    ? 'Unable to parse test output. Check the console for debugging information.'
                    : 'The Node structure created by your code did not match the expected structure. Compare the serialized strings above to see the differences.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
