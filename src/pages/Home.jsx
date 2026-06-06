import React from 'react';
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
  { id: 'dijkstra', name: "Dijkstra's Algorithm" },
  { id: 'astar', name: "A* Search" }
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
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            🗺️ CityPath <span className="text-primary font-light">Visualizer</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Compare pathfinding algorithms on real-world road networks. Place markers, dynamically simulate traffic congestions, block roads, and study Dijkstra vs A* in real-time.
          </p>
        </div>
        
        <div className="flex gap-2">
          <span className="badge badge-primary font-bold py-3">React + Leaflet</span>
          <span className="badge badge-secondary font-bold py-3">DaisyUI v4</span>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6 w-full">
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

        <Legend />

        <StatsPanel
          currentStats={currentStats}
          comparisonStats={comparisonStats}
        />
      </main>

      <footer className="text-center text-xs text-gray-500 py-6 border-t border-gray-800 mt-6">
        CityPath Visualizer &copy; {new Date().getFullYear()} &bull; Designed for CS & GIS Learners
      </footer>
    </div>
  );
}
