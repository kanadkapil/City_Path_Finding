import React, { useState } from 'react';

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
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);

  // Helper styles for toggle buttons
  const getModeClass = (mode) => {
    return interactionMode === mode 
      ? 'bg-secondary-container text-on-secondary-container border-secondary-container' 
      : 'border-outline-variant text-on-surface-variant hover:bg-white/5 hover:text-on-surface';
  };

  return (
    <>
      {/* DESKTOP SIDE NAVBAR */}
      <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex-col py-stack-md w-panel-width backdrop-blur-xl border-r border-outline-variant bg-surface-glass shadow-lg">
        <div className="px-6 mb-8 mt-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">Graph Engine</h2>
          <p className="text-body-sm text-text-muted">V1.1 Stable</p>
        </div>

        <nav className="flex-1 space-y-1">
          {cities.map(city => (
            <button 
              key={city}
              onClick={() => onCityChange(city)}
              disabled={isVisualizing}
              className={`w-[calc(100%-1rem)] flex items-center justify-between px-4 py-3 rounded-xl mx-2 transition-all ${
                selectedCity === city 
                ? 'bg-secondary-container text-on-secondary-container' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined">
                  {selectedCity === city ? 'my_location' : 'location_city'}
                </span>
                <span className="font-body-base font-semibold">{city}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant space-y-4">
            
            {/* Algorithm Selection */}
            <div>
              <label className="text-code-label text-text-muted block mb-2 uppercase">Select Algorithm</label>
              <div className="relative">
                <select 
                  value={selectedAlgorithm}
                  onChange={(e) => onAlgorithmChange(e.target.value)}
                  disabled={isVisualizing}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-sm appearance-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container text-on-surface outline-none"
                >
                  {algorithms.map(alg => (
                    <option key={alg.id} value={alg.id}>{alg.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>

            {/* Speed Control */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-code-label text-text-muted uppercase">Animation Delay</label>
                <span className="text-code-label text-secondary">{animationSpeed}ms</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="5"
                value={animationSpeed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-low rounded-lg appearance-none cursor-pointer accent-secondary-container" 
              />
            </div>

            {/* Modifiers */}
            <div className="space-y-2">
              <button 
                onClick={() => onInteractionModeChange('nodes')}
                className={`w-full py-2 border rounded-lg text-body-sm transition-colors flex items-center justify-center gap-2 ${getModeClass('nodes')}`}
              >
                <span className="material-symbols-outlined text-body-sm">place</span> Select Nodes
              </button>
              <button 
                onClick={() => onInteractionModeChange('blocked')}
                className={`w-full py-2 border rounded-lg text-body-sm transition-colors flex items-center justify-center gap-2 ${getModeClass('blocked')}`}
              >
                <span className="material-symbols-outlined text-body-sm">block</span> Add Roadblock
              </button>
              <button 
                onClick={() => onInteractionModeChange('traffic')}
                className={`w-full py-2 border rounded-lg text-body-sm transition-colors flex items-center justify-center gap-2 ${getModeClass('traffic')}`}
              >
                <span className="material-symbols-outlined text-body-sm">traffic</span> Add Traffic
              </button>
              <button 
                onClick={onRandomizeObstacles}
                disabled={isVisualizing}
                className="w-full py-2 border border-outline-variant rounded-lg text-body-sm text-on-surface hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-body-sm">shuffle</span> Randomize Obstacles
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button 
                onClick={onRun}
                disabled={isVisualizing || !hasStartAndEnd}
                className="w-full py-3 bg-secondary-container text-on-secondary-container font-bold rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">play_arrow</span>
                Run Path Analysis
              </button>
              <button 
                onClick={onReset}
                className="w-full py-3 bg-error-container text-on-error-container font-bold rounded-xl transition-transform active:scale-95 disabled:opacity-50"
              >
                Reset Graph
              </button>
            </div>

          </div>
        </div>
      </aside>

      {/* MOBILE FLOATING ACTION BUTTONS */}
      <div className="md:hidden fixed bottom-[90px] right-6 z-50 flex flex-col gap-4">
        <button 
          onClick={onReset}
          className="w-14 h-14 bg-surface-container-highest text-on-surface rounded-full shadow-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
        <button 
          onClick={onRun}
          disabled={isVisualizing || !hasStartAndEnd}
          className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform ring-4 ring-secondary-container/20 disabled:opacity-50 disabled:active:scale-100"
        >
          <span className="material-symbols-outlined text-3xl">play_arrow</span>
        </button>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div 
        className={`md:hidden bottom-sheet fixed bottom-0 left-0 right-0 z-[60] bg-surface-glass backdrop-blur-xl border-t border-white/10 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${isSheetCollapsed ? 'collapsed' : ''}`}
      >
        {/* Drag Handle */}
        <div className="w-full h-8 flex items-center justify-center cursor-pointer" onClick={() => setIsSheetCollapsed(!isSheetCollapsed)}>
          <div className="w-10 h-1 bg-white/20 rounded-full"></div>
        </div>

        <div className="px-6 pb-10 pt-2 max-h-[70vh] overflow-y-auto no-scrollbar">
          <h2 className="font-headline-md text-primary mb-4 text-center">Graph Engine Controls</h2>
          
          {/* Algorithm Selection */}
          <div className="mb-6">
            <span className="font-code-label text-text-muted block mb-3">SELECT ALGORITHM</span>
            <div className="grid grid-cols-2 gap-3">
              {algorithms.map(alg => (
                <button 
                  key={alg.id}
                  onClick={() => onAlgorithmChange(alg.id)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                    selectedAlgorithm === alg.id
                    ? 'bg-secondary-container text-on-secondary-container shadow-md'
                    : 'bg-white/5 text-on-surface-variant border border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {alg.id === 'dijkstra' ? 'route' : 'bolt'}
                  </span>
                  <span className="font-body-sm font-medium">{alg.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tools & City */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">location_city</span>
                <span className="font-body-base text-on-surface">City</span>
              </div>
              <select 
                value={selectedCity} 
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm outline-none text-secondary"
              >
                {cities.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => onInteractionModeChange('nodes')}
                className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 border ${getModeClass('nodes')}`}
              >
                <span className="material-symbols-outlined text-lg">place</span>
                <span className="text-[10px] font-bold">NODES</span>
              </button>
              <button 
                onClick={() => onInteractionModeChange('blocked')}
                className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 border ${getModeClass('blocked')}`}
              >
                <span className="material-symbols-outlined text-lg">block</span>
                <span className="text-[10px] font-bold">BLOCK</span>
              </button>
              <button 
                onClick={() => onInteractionModeChange('traffic')}
                className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 border ${getModeClass('traffic')}`}
              >
                <span className="material-symbols-outlined text-lg">traffic</span>
                <span className="text-[10px] font-bold">TRAFFIC</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">shuffle</span>
                <span className="font-body-base text-on-surface">Randomize Grid</span>
              </div>
              <button onClick={onRandomizeObstacles} className="bg-white/10 px-3 py-1 rounded text-sm text-secondary hover:bg-white/20 transition-colors">
                Shuffle
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
