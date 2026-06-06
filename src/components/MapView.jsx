import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';

// Helper component to update map view coordinates dynamically when city changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

/**
 * Interactive MapView component for pathfinding visualization on spatial graphs.
 */
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
  const mapZoom = 14;

  // Build a lookup map of nodes for edge coordinates
  const nodeMap = {};
  nodes.forEach(node => {
    nodeMap[node.id] = node;
  });

  // Check if a node is in the final shortest path
  const finalPathSet = new Set(finalPath);

  // Helper to determine node colors and styles based on state
  const getNodeStyle = (nodeId) => {
    const isStart = startNode === nodeId;
    const isDest = destinationNode === nodeId;
    const isPath = finalPathSet.has(nodeId);
    const state = exploredStates[nodeId];

    if (isStart) {
      return {
        fillColor: '#06b6d4', // cyan-500
        color: '#ffffff',
        radius: 10,
        weight: 2.5,
        fillOpacity: 1
      };
    }
    if (isDest) {
      return {
        fillColor: '#ec4899', // pink-500
        color: '#ffffff',
        radius: 10,
        weight: 2.5,
        fillOpacity: 1
      };
    }
    if (isPath) {
      return {
        fillColor: '#f59e0b', // amber-500
        color: '#ffffff',
        radius: 8,
        weight: 2,
        fillOpacity: 0.9
      };
    }
    if (state === 'visited') {
      return {
        fillColor: '#8b5cf6', // purple-500
        color: '#6d28d9', // purple-700
        radius: 7,
        weight: 1.5,
        fillOpacity: 0.8
      };
    }
    if (state === 'exploring') {
      return {
        fillColor: '#3b82f6', // blue-500
        color: '#1d4ed8', // blue-700
        radius: 7,
        weight: 1.5,
        fillOpacity: 0.8
      };
    }
    // Default unvisited node
    return {
      fillColor: '#4b5563', // gray-600
      color: '#1f2937', // gray-800
      radius: 6,
      weight: 1.5,
      fillOpacity: 0.6
    };
  };

  // Helper to determine edge colors and styles based on states
  const getEdgeStyle = (sourceId, targetId) => {
    const edgeKey1 = `${sourceId}-${targetId}`;
    const edgeKey2 = `${targetId}-${sourceId}`;

    const isBlocked = blockedEdges.has(edgeKey1) || blockedEdges.has(edgeKey2);
    if (isBlocked) {
      return {
        color: '#ef4444', // red
        weight: 2.5,
        dashArray: '5, 8',
        opacity: 0.7
      };
    }

    const hasTraffic = trafficEdges.has(edgeKey1) || trafficEdges.has(edgeKey2);
    
    // Check if edge is in the final shortest path
    let isPathEdge = false;
    for (let i = 0; i < finalPath.length - 1; i++) {
      const u = finalPath[i];
      const v = finalPath[i + 1];
      if ((u === sourceId && v === targetId) || (u === targetId && v === sourceId)) {
        isPathEdge = true;
        break;
      }
    }

    if (isPathEdge) {
      return {
        color: '#f59e0b', // amber-500
        weight: 5,
        dashArray: null,
        opacity: 0.9
      };
    }

    // Check if edge was explored during algorithm search
    const isExplored = exploredEdges.has(edgeKey1) || exploredEdges.has(edgeKey2);
    if (isExplored) {
      return {
        color: '#8b5cf6', // purple-500
        weight: 3,
        dashArray: null,
        opacity: 0.8
      };
    }

    if (hasTraffic) {
      return {
        color: '#f59e0b', // amber traffic
        weight: 3.5,
        dashArray: null,
        opacity: 0.85
      };
    }

    // Default street segment
    return {
      color: '#4b5563', // gray-600
      weight: 2,
      dashArray: null,
      opacity: 0.45
    };
  };

  const handleNodeClick = (nodeId) => {
    if (interactionMode === 'nodes') {
      onNodeSelect(nodeId);
    }
  };

  const handleEdgeClick = (sourceId, targetId) => {
    if (interactionMode === 'blocked' || interactionMode === 'traffic') {
      onEdgeToggle(sourceId, targetId, interactionMode);
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
      {/* Interactive Helper Overlay for Map Tool */}
      <div className="absolute top-3 right-3 z-[1000] bg-neutral/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 border border-gray-800 pointer-events-none shadow-md">
        Mode: {interactionMode === 'nodes' ? (
          <span className="text-primary font-bold">📍 Node Selector</span>
        ) : interactionMode === 'blocked' ? (
          <span className="text-error font-bold">🚧 Toggle Roadblock</span>
        ) : (
          <span className="text-warning font-bold">🚗 Toggle Congestion</span>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView center={center} zoom={mapZoom} />

        {/* Premium Dark Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Render Graph Edges (Polylines) */}
        {edges.map((edge, index) => {
          const u = nodeMap[edge.source];
          const v = nodeMap[edge.target];
          if (!u || !v) return null;

          const style = getEdgeStyle(edge.source, edge.target);

          return (
            <Polyline
              key={`edge-${edge.source}-${edge.target}-${index}`}
              positions={[
                [u.lat, u.lng],
                [v.lat, v.lng]
              ]}
              eventHandlers={{
                click: () => handleEdgeClick(edge.source, edge.target)
              }}
              pathOptions={{
                color: style.color,
                weight: style.weight,
                dashArray: style.dashArray,
                opacity: style.opacity,
                interactive: interactionMode !== 'nodes',
                bubblingMouseEvents: false
              }}
            >
              <Tooltip sticky>
                <div className="text-xs">
                  <span>Street between: <b>{u.label}</b> & <b>{v.label}</b></span>
                  {trafficEdges.has(`${edge.source}-${edge.target}`) || trafficEdges.has(`${edge.target}-${edge.source}`) ? (
                    <span className="text-amber-500 font-bold block">⚠️ Heavy Traffic</span>
                  ) : null}
                  {blockedEdges.has(`${edge.source}-${edge.target}`) || blockedEdges.has(`${edge.target}-${edge.source}`) ? (
                    <span className="text-red-500 font-bold block">🚫 Blocked Road</span>
                  ) : null}
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Render Graph Nodes (Circle Markers) */}
        {nodes.map((node) => {
          const style = getNodeStyle(node.id);

          return (
            <CircleMarker
              key={`node-${node.id}`}
              center={[node.lat, node.lng]}
              radius={style.radius}
              className="node-transition"
              pathOptions={{
                fillColor: style.fillColor,
                color: style.color,
                weight: style.weight,
                fillOpacity: style.fillOpacity
              }}
              eventHandlers={{
                click: () => handleNodeClick(node.id)
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9} sticky>
                <div className="text-xs font-semibold">
                  <span className="text-primary">{node.id}:</span> {node.label}
                  {startNode === node.id && <span className="text-cyan-400 block font-bold mt-0.5">📍 Start Point</span>}
                  {destinationNode === node.id && <span className="text-pink-400 block font-bold mt-0.5">📍 Destination Point</span>}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
