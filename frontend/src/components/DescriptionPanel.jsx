import React from 'react';

export default function DescriptionPanel({ isExpanded, onToggle, description }) {
  if (!isExpanded) {
    return (
      <div className="description-panel collapsed">
        <button 
          className="btn-sidebar-toggle"
          onClick={onToggle}
          title="Show description"
        >
          ▶
        </button>
      </div>
    );
  }

  return (
    <div className="description-panel">
      <div className="description-header">
        <h2>Problem Description</h2>
        <button 
          className="btn-sidebar-toggle"
          onClick={onToggle}
          title="Hide description"
        >
          ◀
        </button>
      </div>
      <div className="description-content">
        <div 
          className="description-content-inner"
          dangerouslySetInnerHTML={{ __html: description || '<p>Loading description...</p>' }}
        />
      </div>
    </div>
  );
}

