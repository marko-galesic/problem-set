import React from 'react';
import { IconButton } from '@mui/material';

export default function DescriptionPanel({ isExpanded, onToggle, description }) {
  if (!isExpanded) {
    return (
      <div className="description-panel collapsed">
        <IconButton 
          className="btn btn--icon btn--ghost btn-sidebar-toggle"
          onClick={onToggle}
          title="Show description"
          type="button"
        >
          ▶
        </IconButton>
      </div>
    );
  }

  return (
    <div className="description-panel">
      <div className="description-header">
        <h2>Problem Description</h2>
        <IconButton 
          className="btn btn--icon btn--ghost btn-sidebar-toggle"
          onClick={onToggle}
          title="Hide description"
          type="button"
        >
          ◀
        </IconButton>
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
