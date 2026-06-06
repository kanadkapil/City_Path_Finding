import { useState, useRef, useCallback, useEffect } from 'react';
import { buildGraph } from '../utils/graphBuilder';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';

/**
 * Custom hook to manage the pathfinding algorithm execution, state, and visualization loops.
 */
export function usePathfinding() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const [animateExploration, setAnimateExploration] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(40);

  // Visualization Progress States
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [exploredStates, setExploredStates] = useState({});
  const [exploredEdges, setExploredEdges] = useState(new Set());
  const [finalPath, setFinalPath] = useState([]);

  // Stats & Performance Results
  const [currentStats, setCurrentStats] = useState(null);
  const [comparisonStats, setComparisonStats] = useState({ dijkstra: null, astar: null });

  const animationTimeoutRefs = useRef([]);

  const clearTimers = useCallback(() => {
    animationTimeoutRefs.current.forEach(clearTimeout);
    animationTimeoutRefs.current = [];
  }, []);

  const clearVisualizationOnly = useCallback(() => {
    clearTimers();
    setIsVisualizing(false);
    setExploredStates({});
    setExploredEdges(new Set());
    setFinalPath([]);
    setCurrentStats(null);
  }, [clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handleRun = useCallback((nodes, edges, blockedEdges, trafficEdges, startNode, destinationNode) => {
    if (isVisualizing || !startNode || !destinationNode) return;

    clearVisualizationOnly();

    // 1. Build Graph
    const graph = buildGraph(nodes, edges, blockedEdges, trafficEdges, 2.5);

    // 2. Execute Algorithm
    let result;
    if (selectedAlgorithm === 'dijkstra') {
      result = dijkstra(graph, startNode, destinationNode);
    } else {
      result = astar(graph, startNode, destinationNode, nodes);
    }

    const { path, exploredNodes, distance, executionTime } = result;

    if (path.length === 0) {
      alert("No path could be found between the selected nodes! Check for roadblocks.");
      return;
    }

    // 3. Visualization Loop
    if (!animateExploration) {
      const finalStates = {};
      const finalEdges = new Set();

      exploredNodes.forEach(step => {
        finalStates[step.id] = step.type;
        if (step.parent) {
          finalEdges.add(`${step.parent}-${step.id}`);
        }
      });

      setExploredStates(finalStates);
      setExploredEdges(finalEdges);
      setFinalPath(path);

      const stats = {
        algorithm: selectedAlgorithm === 'dijkstra' ? "Dijkstra's" : "A* Search",
        distance,
        nodesExplored: exploredNodes.filter(n => n.type === 'visited').length,
        executionTime,
        pathLength: path.length
      };

      setCurrentStats(stats);
      setComparisonStats(prev => ({ ...prev, [selectedAlgorithm]: stats }));
    } else {
      setIsVisualizing(true);

      const animStates = {};
      const animEdges = new Set();
      
      // Step-by-step frontier exploration animation
      exploredNodes.forEach((step, index) => {
        const timer = setTimeout(() => {
          animStates[step.id] = step.type;
          if (step.parent) {
            animEdges.add(`${step.parent}-${step.id}`);
            animEdges.add(`${step.id}-${step.parent}`);
          }
          setExploredStates({ ...animStates });
          setExploredEdges(new Set(animEdges));
        }, index * animationSpeed);
        
        animationTimeoutRefs.current.push(timer);
      });

      // Animate the construction of the final shortest path
      const explorationDuration = exploredNodes.length * animationSpeed;
      const pathDelay = 50;

      path.forEach((nodeId, index) => {
        const timer = setTimeout(() => {
          setFinalPath(prev => [...prev, nodeId]);
          
          if (index === path.length - 1) {
            setIsVisualizing(false);
            const stats = {
              algorithm: selectedAlgorithm === 'dijkstra' ? "Dijkstra's" : "A* Search",
              distance,
              nodesExplored: exploredNodes.filter(n => n.type === 'visited').length,
              executionTime,
              pathLength: path.length
            };
            setCurrentStats(stats);
            setComparisonStats(prev => ({ ...prev, [selectedAlgorithm]: stats }));
          }
        }, explorationDuration + index * pathDelay);

        animationTimeoutRefs.current.push(timer);
      });
    }
  }, [
    isVisualizing, clearVisualizationOnly, selectedAlgorithm, 
    animateExploration, animationSpeed
  ]);

  const resetPathfindingStats = useCallback(() => {
    setComparisonStats({ dijkstra: null, astar: null });
  }, []);

  return {
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
  };
}
