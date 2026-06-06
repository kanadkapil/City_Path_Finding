import React from 'react';

/**
 * Legend component that provides a visual key for all states and elements
 * displayed on the map visualizer.
 */
export default function Legend() {
  const legendItems = [
    { label: 'Start Node', type: 'node', color: 'bg-success border-success' },
    { label: 'Destination Node', type: 'node', color: 'bg-error border-error' },
    { label: 'Exploring Frontier', type: 'node', color: 'bg-warning border-warning' },
    { label: 'Visited Node', type: 'node', color: 'bg-info border-info' },
    { label: 'Shortest Path', type: 'edge', color: 'bg-secondary', styleClass: 'h-1.5 w-8 rounded-full' },
    { label: 'Heavy Traffic (x2.5)', type: 'edge', color: 'bg-yellow-500', styleClass: 'h-1 w-8 border-b-2 border-yellow-500' },
    { label: 'Blocked Road', type: 'edge', color: 'bg-transparent', styleClass: 'w-8 border-b-2 border-dashed border-red-500' }
  ];

  return (
    <div className="card bg-neutral text-neutral-content shadow-lg border border-gray-800 p-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h4 className="text-sm font-bold tracking-wider uppercase text-primary">Legend</h4>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.type === 'node' ? (
                <div className={`w-3.5 h-3.5 rounded-full border border-white/20 shadow-md ${item.color.split(' ')[0]}`} />
              ) : (
                <div className={`${item.styleClass} opacity-80`} />
              )}
              <span className="font-medium text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
