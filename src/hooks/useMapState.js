import { useState, useCallback } from 'react';

/**
 * Custom hook to manage the state of map interactions (selected city, 
 * nodes, and dynamic obstacles).
 */
export function useMapState(cityDataMap, defaultCity = 'London') {
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [interactionMode, setInteractionMode] = useState('nodes'); // 'nodes' | 'blocked' | 'traffic'
  
  // Selection States
  const [startNode, setStartNode] = useState(null);
  const [destinationNode, setDestinationNode] = useState(null);

  // Dynamic Obstacles & Weights
  const [blockedEdges, setBlockedEdges] = useState(new Set());
  const [trafficEdges, setTrafficEdges] = useState(new Set());

  // Fetch current city graph details
  const currentCityData = cityDataMap[selectedCity];
  const { nodes, edges, center } = currentCityData;

  const handleCityChange = useCallback((cityName) => {
    setSelectedCity(cityName);
    setStartNode(null);
    setDestinationNode(null);
    setBlockedEdges(new Set());
    setTrafficEdges(new Set());
  }, []);

  const handleNodeSelect = useCallback((nodeId, isVisualizing) => {
    if (isVisualizing) return;

    if (!startNode || (startNode && destinationNode)) {
      setStartNode(nodeId);
      setDestinationNode(null);
    } else if (startNode && !destinationNode) {
      if (nodeId === startNode) {
        setStartNode(null);
      } else {
        setDestinationNode(nodeId);
      }
    }
  }, [startNode, destinationNode]);

  const handleEdgeToggle = useCallback((sourceId, targetId, mode, isVisualizing) => {
    if (isVisualizing) return;

    const edgeKey1 = `${sourceId}-${targetId}`;
    const edgeKey2 = `${targetId}-${sourceId}`;

    if (mode === 'blocked') {
      setBlockedEdges(prev => {
        const newSet = new Set(prev);
        if (newSet.has(edgeKey1) || newSet.has(edgeKey2)) {
          newSet.delete(edgeKey1);
          newSet.delete(edgeKey2);
        } else {
          setTrafficEdges(prevTraffic => {
            const nextTraffic = new Set(prevTraffic);
            nextTraffic.delete(edgeKey1);
            nextTraffic.delete(edgeKey2);
            return nextTraffic;
          });
          newSet.add(edgeKey1);
        }
        return newSet;
      });
    } else if (mode === 'traffic') {
      setTrafficEdges(prev => {
        const newSet = new Set(prev);
        if (newSet.has(edgeKey1) || newSet.has(edgeKey2)) {
          newSet.delete(edgeKey1);
          newSet.delete(edgeKey2);
        } else {
          setBlockedEdges(prevBlocked => {
            const nextBlocked = new Set(prevBlocked);
            nextBlocked.delete(edgeKey1);
            nextBlocked.delete(edgeKey2);
            return nextBlocked;
          });
          newSet.add(edgeKey1);
        }
        return newSet;
      });
    }
  }, []);

  const handleRandomizeObstacles = useCallback((isVisualizing) => {
    if (isVisualizing) return;

    const newBlocked = new Set();
    const newTraffic = new Set();

    edges.forEach(edge => {
      const rand = Math.random();
      const edgeKey = `${edge.source}-${edge.target}`;
      if (rand < 0.12) {
        newBlocked.add(edgeKey);
      } else if (rand >= 0.12 && rand < 0.25) {
        newTraffic.add(edgeKey);
      }
    });

    setBlockedEdges(newBlocked);
    setTrafficEdges(newTraffic);
  }, [edges]);

  const handleClearObstacles = useCallback((isVisualizing) => {
    if (isVisualizing) return;
    setBlockedEdges(new Set());
    setTrafficEdges(new Set());
  }, []);

  const resetSelection = useCallback(() => {
    setStartNode(null);
    setDestinationNode(null);
    setBlockedEdges(new Set());
    setTrafficEdges(new Set());
  }, []);

  return {
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
  };
}
