import React from 'react';

export default function StatsPanel({ currentStats, comparisonStats }) {
  if (!currentStats) return null;

  return (
    <>
      {/* MOBILE STATS BANNER (Level 2) */}
      <div className="md:hidden fixed top-20 left-4 right-4 z-40">
        <div className="flex justify-between items-center bg-surface-glass backdrop-blur-xl border border-white/5 rounded-xl px-4 py-3 shadow-lg">
          <div className="flex flex-col">
            <span className="font-code-label text-text-muted">DISTANCE</span>
            <span className="font-stat-value text-on-surface">
              {currentStats.distance.toFixed(2)} <small className="text-[10px]">KM</small>
            </span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex flex-col">
            <span className="font-code-label text-text-muted">VISITED</span>
            <span className="font-stat-value text-on-surface">
              {currentStats.nodesExplored.toLocaleString()}
            </span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex flex-col">
            <span className="font-code-label text-text-muted">TIME</span>
            <span className="font-stat-value text-on-surface">
              {Math.round(currentStats.executionTime)}<small className="text-[10px]">MS</small>
            </span>
          </div>
        </div>
      </div>

      {/* DESKTOP STATS & METRICS (Bottom Right) */}
      <div className="hidden md:flex fixed bottom-edge-margin right-edge-margin gap-gutter z-40">
        <div className="backdrop-blur-xl bg-surface-glass border border-outline-variant p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[120px]">
          <span className="text-code-label text-text-muted uppercase mb-1">Distance</span>
          <span className="font-stat-value text-stat-value text-secondary">
            {currentStats.distance.toFixed(2)}km
          </span>
        </div>
        <div className="backdrop-blur-xl bg-surface-glass border border-outline-variant p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[120px]">
          <span className="text-code-label text-text-muted uppercase mb-1">Explored</span>
          <span className="font-stat-value text-stat-value text-visited">
            {currentStats.nodesExplored.toLocaleString()}
          </span>
        </div>
        <div className="backdrop-blur-xl bg-surface-glass border border-outline-variant p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[120px]">
          <span className="text-code-label text-text-muted uppercase mb-1">Time</span>
          <span className="font-stat-value text-stat-value text-shortest-path">
            {Math.round(currentStats.executionTime)}ms
          </span>
        </div>
      </div>
    </>
  );
}
