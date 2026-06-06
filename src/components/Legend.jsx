import React from 'react';

export default function Legend() {
  return (
    <div className="hidden md:flex absolute bottom-edge-margin left-edge-margin backdrop-blur-xl bg-surface-glass border border-outline-variant p-stack-md rounded-xl shadow-lg w-48 flex-col gap-2">
      <h3 className="text-code-label text-text-muted mb-3 uppercase tracking-wider">Map Legend</h3>
      
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-start-node"></div>
        <span className="text-code-label">Start Point</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-end-node"></div>
        <span className="text-code-label">Destination</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-shortest-path"></div>
        <span className="text-code-label">Optimized Path</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-visited"></div>
        <span className="text-code-label">Visited Node</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-frontier"></div>
        <span className="text-code-label">Current Frontier</span>
      </div>
      
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-outline-variant">
        <div className="w-3 h-1 bg-error"></div>
        <span className="text-code-label">Roadblock</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-3 h-1 bg-shortest-path opacity-80"></div>
        <span className="text-code-label">Heavy Traffic</span>
      </div>
    </div>
  );
}
