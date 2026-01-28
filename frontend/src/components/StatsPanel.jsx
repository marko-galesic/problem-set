import React from 'react';
import { Button } from '@mui/material';
import { getImplementations, getAverageTime, clearImplementations } from '../utils/storage';

export default function StatsPanel({ refreshTrigger }) {
  const [implementations, setImplementations] = React.useState([]);
  const [avgTime, setAvgTime] = React.useState(0);

  React.useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  function loadStats() {
    const impls = getImplementations();
    setImplementations(impls);
    setAvgTime(getAverageTime());
  }

  function handleClear() {
    if (window.confirm('Are you sure you want to clear all saved implementations?')) {
      clearImplementations();
      loadStats();
    }
  }

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h2>Statistics</h2>
        <Button onClick={handleClear} className="btn btn--xs btn-clear" type="button">
          Clear All
        </Button>
      </div>
      
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">Total Submissions:</span>
          <span className="stat-value">{implementations.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Time:</span>
          <span className="stat-value">{avgTime}ms</span>
        </div>
      </div>

      {implementations.length > 0 && (
        <div className="implementations-list">
          <h3>Saved Implementations</h3>
          <div className="impl-list">
            {implementations.slice().reverse().map((impl) => (
              <div key={impl.id} className="impl-item">
                <div className="impl-header">
                  <span className="impl-date">
                    {new Date(impl.timestamp).toLocaleString()}
                  </span>
                  <span className={`impl-status ${impl.passed ? 'passed' : 'failed'}`}>
                    {impl.passed ? '✓ Passed' : '✗ Failed'}
                  </span>
                </div>
                <div className="impl-details">
                  <span>Tests: {impl.testCount}</span>
                  <span>Avg Time: {impl.avgTime}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {implementations.length === 0 && (
        <p className="no-stats">No submissions yet. Submit your code to see statistics.</p>
      )}
    </div>
  );
}
