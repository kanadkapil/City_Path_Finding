import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function MapView({
  nodes,
  edges,
  center,
  startNode,
  destinationNode,
  exploredStates,
  finalPath,
  exploredEdges,
  blockedEdges,
  trafficEdges,
  interactionMode,
  onNodeSelect,
  onEdgeToggle
}) {
  
  // Memoize static map geometries
  const { nodeMap, staticEdges } = useMemo(() => {
    const nodeMap = new Map();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const staticEdges = edges.map(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      return {
        ...edge,
        sourceCoords: [sourceNode.lat, sourceNode.lng],
        targetCoords: [targetNode.lat, targetNode.lng],
        id: `${edge.source}-${edge.target}`
      };
    });

    return { nodeMap, staticEdges };
  }, [nodes, edges]);

  // Color mappings based on new tailwind configuration
  const getNodeColor = (nodeId) => {
    if (nodeId === startNode) return '#22D3EE'; // start-node (Cyan)
    if (nodeId === destinationNode) return '#F472B6'; // end-node (Pink)
    if (finalPath.includes(nodeId)) return '#FBBF24'; // shortest-path (Amber)
    if (exploredStates[nodeId] === 'visited') return '#8B5CF6'; // visited (Purple)
    if (exploredStates[nodeId] === 'exploring') return '#60A5FA'; // frontier (Blue)
    return '#64748b'; // slate-500 for better visibility
  };

  const getNodeRadius = (nodeId) => {
    if (nodeId === startNode || nodeId === destinationNode) return 10;
    if (finalPath.includes(nodeId)) return 8;
    return 5;
  };

  const getEdgeStyle = (edgeId) => {
    const isBlocked = blockedEdges.has(edgeId);
    const isTraffic = trafficEdges.has(edgeId);
    const isExplored = exploredEdges.has(edgeId);

    // Default static edge
    let color = 'rgba(255,255,255,0.25)'; // Brighter so it's visible against the dark map
    let weight = 2.5;
    let dashArray = null;

    if (isBlocked) {
      color = '#ffb4ab'; // error
      dashArray = '5, 10';
      weight = 3;
    } else if (isTraffic) {
      color = '#FBBF24'; // warning (orange)
      weight = 4;
    } else if (isExplored) {
      color = '#8B5CF6'; // visited (Purple)
      weight = 3;
    }

    return { color, weight, dashArray };
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <MapContainer 
        center={center} 
        zoom={14} 
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        className="bg-surface"
      >
        <MapUpdater center={center} />
        
        {/* Dark Mode Map Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Render Edges */}
        {staticEdges.map(edge => {
          const style = getEdgeStyle(edge.id);
          const isExplored = exploredEdges.has(edge.id);
          
          return (
            <Polyline
              key={edge.id}
              positions={[edge.sourceCoords, edge.targetCoords]}
              pathOptions={{
                color: style.color,
                weight: style.weight,
                dashArray: style.dashArray,
                opacity: isExplored ? 0.9 : 0.6
              }}
              eventHandlers={{
                click: () => {
                  if (interactionMode === 'blocked' || interactionMode === 'traffic') {
                    onEdgeToggle(edge.source, edge.target, interactionMode);
                  }
                }
              }}
              className={interactionMode !== 'nodes' ? 'cursor-pointer hover:stroke-white transition-colors' : ''}
            />
          );
        })}

        {/* Render Shortest Path Line on Top */}
        {finalPath.length > 0 && (
          <Polyline
            positions={finalPath.map(id => [nodeMap.get(id).lat, nodeMap.get(id).lng])}
            pathOptions={{ color: '#FBBF24', weight: 5, className: 'animate-[dash_20s_linear_infinite]' }} // shortest-path
          />
        )}

        {/* Render Nodes */}
        {nodes.map(node => {
          const color = getNodeColor(node.id);
          const radius = getNodeRadius(node.id);
          const isStartOrEnd = node.id === startNode || node.id === destinationNode;
          
          return (
            <CircleMarker
              key={node.id}
              center={[node.lat, node.lng]}
              radius={radius}
              pathOptions={{ 
                fillColor: color, 
                fillOpacity: 1, 
                color: isStartOrEnd ? '#ffffff' : color, 
                weight: isStartOrEnd ? 2 : 0,
                className: isStartOrEnd ? 'node-transition node-pulse' : 'node-transition'
              }}
              eventHandlers={{
                click: () => {
                  if (interactionMode === 'nodes') {
                    onNodeSelect(node.id);
                  }
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} className="bg-surface-container text-on-surface border-outline-variant font-code-label">
                <div className="flex flex-col">
                  <span className="font-bold text-secondary">{node.label}</span>
                  {node.id === startNode && <span className="text-[10px] text-start-node">START</span>}
                  {node.id === destinationNode && <span className="text-[10px] text-end-node">DESTINATION</span>}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
