import { haversineDistance } from './haversineDistance.js';

/**
 * Builds an adjacency list from nodes and edges.
 * Supports blocked roads and traffic settings for dynamic routing.
 * 
 * @param {Array} nodes - List of nodes, each containing { id, lat, lng }
 * @param {Array} edges - List of undirected edges, each containing { source, target }
 * @param {Set<string>} blockedEdges - Set of edge identifiers (e.g., "nodeA-nodeB" or "nodeB-nodeA") that are blocked
 * @param {Set<string>} trafficEdges - Set of edge identifiers that have heavy traffic
 * @param {number} trafficMultiplier - Multiplier applied to edge weight when traffic is present
 * @returns {Object} Adjacency list: { nodeId: [ { node: neighborId, weight: distance, isTraffic: boolean } ] }
 */
export function buildGraph(nodes, edges, blockedEdges = new Set(), trafficEdges = new Set(), trafficMultiplier = 2.5) {
  // Map for fast node coordinate retrieval
  const nodeMap = {};
  nodes.forEach(node => {
    nodeMap[node.id] = node;
  });

  // Initialize adjacency list
  const adjacencyList = {};
  nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });

  // Helper to generate edge keys
  const getEdgeKeys = (u, v) => [`${u}-${v}`, `${v}-${u}`];

  edges.forEach(edge => {
    const { source, target } = edge;
    const [key1, key2] = getEdgeKeys(source, target);

    // Skip if the road is blocked
    if (blockedEdges.has(key1) || blockedEdges.has(key2)) {
      return;
    }

    const u = nodeMap[source];
    const v = nodeMap[target];

    if (u && v) {
      const baseWeight = haversineDistance(u.lat, u.lng, v.lat, v.lng);
      const hasTraffic = trafficEdges.has(key1) || trafficEdges.has(key2);
      const weight = hasTraffic ? baseWeight * trafficMultiplier : baseWeight;

      // Add bi-directional edges (undirected graph representation)
      adjacencyList[source].push({
        node: target,
        weight: weight,
        baseWeight: baseWeight,
        isTraffic: hasTraffic
      });

      adjacencyList[target].push({
        node: source,
        weight: weight,
        baseWeight: baseWeight,
        isTraffic: hasTraffic
      });
    }
  });

  return adjacencyList;
}
