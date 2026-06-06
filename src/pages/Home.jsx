import React, { useState } from 'react';
import londonData from '../data/london.json';
import delhiData from '../data/delhi.json';
import newyorkData from '../data/newyork.json';

import { useMapState } from '../hooks/useMapState';
import { usePathfinding } from '../hooks/usePathfinding';

import MapView from '../components/MapView';
import ControlPanel from '../components/ControlPanel';
import StatsPanel from '../components/StatsPanel';
import Legend from '../components/Legend';

const cityDataMap = {
  'London': londonData,
  'Delhi': delhiData,
  'New York': newyorkData
};

const algorithms = [
  { id: 'astar', name: "A* Search" },
  { id: 'dijkstra', name: "Dijkstra's Algorithm" }
];

export default function Home() {
  const {
    selectedCity,
    currentCityData,
    nodes,
    edges,
    center,
    interactionMode,
    setInteractionMode,
    startNode,
    destinationNode,
    blockedEdges,
    trafficEdges,
    handleCityChange,
    handleNodeSelect,
    handleEdgeToggle,
    handleRandomizeObstacles,
    handleClearObstacles,
    resetSelection
  } = useMapState(cityDataMap, 'London');

  const {
    selectedAlgorithm,
    setSelectedAlgorithm,
    animateExploration,
    setAnimateExploration,
    animationSpeed,
    setAnimationSpeed,
    isVisualizing,
    exploredStates,
    exploredEdges,
    finalPath,
    currentStats,
    comparisonStats,
    handleRun,
    clearVisualizationOnly,
    resetPathfindingStats
  } = usePathfinding();

  // Integrated Reset
  const handleReset = () => {
    clearVisualizationOnly();
    resetSelection();
    resetPathfindingStats();
  };

  // Integrated City Change
  const onCityChange = (cityName) => {
    handleCityChange(cityName);
    clearVisualizationOnly();
    resetPathfindingStats();
  };

  // Integrated Run
  const onRun = () => {
    handleRun(nodes, edges, blockedEdges, trafficEdges, startNode, destinationNode);
  };

  return (
    <div className="w-full h-full">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-edge-margin h-16 backdrop-blur-xl bg-surface-glass border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="material-symbols-outlined text-primary text-2xl">location_city</span>
          <div className="flex flex-col">
            <h1 className="font-display-lg text-lg md:text-headline-md font-bold text-primary tracking-tight leading-none">PathFinder GIS</h1>
            <span className="text-[10px] text-text-muted font-code-label uppercase tracking-widest">{selectedCity} DISTRICT</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center bg-surface-container h-10 px-4 rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input 
              type="text" 
              placeholder={`Search ${selectedCity}...`} 
              className="bg-transparent border-none focus:ring-0 text-body-sm w-64 text-on-surface p-0" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-on-surface-variant">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-on-surface-variant">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Map Background */}
      <div className="fixed inset-0 z-0">
        <MapView
          nodes={nodes}
          edges={edges}
          center={center}
          startNode={startNode}
          destinationNode={destinationNode}
          exploredStates={exploredStates}
          finalPath={finalPath}
          exploredEdges={exploredEdges}
          blockedEdges={blockedEdges}
          trafficEdges={trafficEdges}
          interactionMode={interactionMode}
          onNodeSelect={(nodeId) => {
            handleNodeSelect(nodeId, isVisualizing);
            if (!isVisualizing) clearVisualizationOnly();
          }}
          onEdgeToggle={(src, tgt, mode) => {
            handleEdgeToggle(src, tgt, mode, isVisualizing);
            if (!isVisualizing) clearVisualizationOnly();
          }}
        />
      </div>

      {/* Interactive Floating Overlays */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="pointer-events-auto">
          <ControlPanel
            cities={Object.keys(cityDataMap)}
            selectedCity={selectedCity}
            onCityChange={onCityChange}
            algorithms={algorithms}
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
            onRun={onRun}
            onReset={handleReset}
            isVisualizing={isVisualizing}
            hasStartAndEnd={startNode !== null && destinationNode !== null}
            animationSpeed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
            animateExploration={animateExploration}
            onAnimateExplorationToggle={setAnimateExploration}
            interactionMode={interactionMode}
            onInteractionModeChange={setInteractionMode}
            onRandomizeObstacles={() => handleRandomizeObstacles(isVisualizing)}
            onClearObstacles={() => {
              handleClearObstacles(isVisualizing);
              clearVisualizationOnly();
              resetPathfindingStats();
            }}
          />

          <Legend />

          <StatsPanel
            currentStats={currentStats}
            comparisonStats={comparisonStats}
          />
        </div>
      </div>
    </div>
  );
}
