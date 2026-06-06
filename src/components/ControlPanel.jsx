import React from 'react';
import CitySelector from './CitySelector';

/**
 * ControlPanel component housing the primary controls for the visualizer.
 */
export default function ControlPanel({
  cities,
  selectedCity,
  onCityChange,
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
  onRun,
  onReset,
  isVisualizing,
  hasStartAndEnd,
  animationSpeed,
  onSpeedChange,
  animateExploration,
  onAnimateExplorationToggle,
  interactionMode,
  onInteractionModeChange,
  onRandomizeObstacles,
  onClearObstacles
}) {
  return (
    <div className="card bg-neutral text-neutral-content shadow-lg border border-gray-800 p-5 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Step 1: Selection Dropdowns */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold tracking-wider uppercase text-primary">1. Configuration</h4>
          
          <CitySelector
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={onCityChange}
            disabled={isVisualizing}
          />

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs text-gray-400">Select Pathfinding Algorithm</span>
            </label>
            <select
              className="select select-bordered select-sm select-secondary w-full bg-base-100 text-sm font-semibold"
              value={selectedAlgorithm}
              onChange={(e) => onAlgorithmChange(e.target.value)}
              disabled={isVisualizing}
            >
              {algorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Animation & Speed Settings */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold tracking-wider uppercase text-primary">2. Simulation Settings</h4>
          
          <div className="form-control">
            <label className="label cursor-pointer py-1 flex justify-between">
              <span className="label-text text-xs text-gray-400">Animate Search Process</span>
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                checked={animateExploration}
                onChange={(e) => onAnimateExplorationToggle(e.target.checked)}
                disabled={isVisualizing}
              />
            </label>
          </div>

          {animateExploration && (
            <div className="form-control w-full">
              <label className="label py-1 flex justify-between">
                <span className="label-text text-xs text-gray-400">Animation Delay</span>
                <span className="text-xs font-bold text-secondary">{animationSpeed}ms</span>
              </label>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={animationSpeed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="range range-secondary range-xs"
                disabled={isVisualizing}
              />
              <div className="w-full flex justify-between text-[10px] text-gray-500 px-1 mt-1">
                <span>Fast (5ms)</span>
                <span>Slow (300ms)</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Interactive Map Edit Modes */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold tracking-wider uppercase text-primary">3. Map Interaction Mode</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => onInteractionModeChange('nodes')}
              className={`btn btn-xs justify-start gap-2 ${
                interactionMode === 'nodes' ? 'btn-primary' : 'btn-ghost border border-gray-800'
              }`}
              disabled={isVisualizing}
              title="Click on map markers to define starting point and destination."
            >
              <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
              <span>Select Start / End Nodes</span>
            </button>

            <button
              onClick={() => onInteractionModeChange('blocked')}
              className={`btn btn-xs justify-start gap-2 ${
                interactionMode === 'blocked' ? 'btn-error' : 'btn-ghost border border-gray-800'
              }`}
              disabled={isVisualizing}
              title="Click on street lines to block them and force detour calculations."
            >
              <div className="w-4 h-0.5 border-b-2 border-dashed border-red-500"></div>
              <span>Toggle Road Blockages</span>
            </button>

            <button
              onClick={() => onInteractionModeChange('traffic')}
              className={`btn btn-xs justify-start gap-2 ${
                interactionMode === 'traffic' ? 'btn-warning text-black' : 'btn-ghost border border-gray-800'
              }`}
              disabled={isVisualizing}
              title="Click on street lines to simulate high traffic congestion (increases travel weight)."
            >
              <div className="w-4 h-1 bg-yellow-500"></div>
              <span>Toggle Heavy Traffic</span>
            </button>
          </div>
        </div>

        {/* Step 4: Run / Reset Actions */}
        <div className="flex flex-col justify-end gap-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRandomizeObstacles}
              className="btn btn-outline btn-xs border-gray-800 hover:btn-accent text-gray-300 font-semibold"
              disabled={isVisualizing}
            >
              Random Obstacles
            </button>
            <button
              onClick={onClearObstacles}
              className="btn btn-outline btn-xs border-gray-800 hover:btn-error text-gray-300 font-semibold"
              disabled={isVisualizing}
            >
              Clear Map Modifiers
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReset}
              className="btn btn-neutral border border-gray-700 btn-sm text-sm font-bold uppercase tracking-wider hover:bg-gray-800"
              disabled={isVisualizing}
            >
              Reset Graph
            </button>

            <button
              onClick={onRun}
              className={`btn btn-sm text-sm font-bold uppercase tracking-wider ${
                isVisualizing
                  ? 'btn-disabled bg-gray-800 text-gray-500'
                  : 'btn-primary shadow-md shadow-primary/20'
              }`}
              disabled={isVisualizing || !hasStartAndEnd}
            >
              {isVisualizing ? 'Running...' : 'Run Visualizer'}
            </button>
          </div>
          
          {!hasStartAndEnd && !isVisualizing && (
            <span className="text-[10px] text-error font-medium text-center">
              ⚠️ Select Start & Destination on map
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
