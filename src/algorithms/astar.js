import { PriorityQueue } from './priorityQueue.js';
import { haversineDistance } from '../utils/haversineDistance.js';

/**
 * A* shortest path search algorithm.
 * 
 * @param {Object} graph - The adjacency list of the graph: { nodeId: [ { node: neighborId, weight } ] }
 * @param {string} startNodeId - Starting node ID
 * @param {string} targetNodeId - Target destination node ID
 * @param {Array} nodes - Array of nodes with coordinates { id, lat, lng } for heuristic calculation
 * @returns {Object} { path, exploredNodes, distance, executionTime }
 */
export function astar(graph, startNodeId, targetNodeId, nodes) {
  const startTime = performance.now();

  // Index nodes for O(1) coordinate lookup
  const nodeMap = {};
  nodes.forEach(node => {
    nodeMap[node.id] = node;
  });

  const gScore = {}; // Cost from start to current node
  const fScore = {}; // Estimated total cost (g + h)
  const parents = {};
  const visited = new Set();
  const pq = new PriorityQueue();
  const exploredSteps = [];

  // Initialize scores
  Object.keys(graph).forEach(nodeId => {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
    parents[nodeId] = null;
  });

  gScore[startNodeId] = 0;

  const startNode = nodeMap[startNodeId];
  const targetNode = nodeMap[targetNodeId];
  
  let hStart = 0;
  if (startNode && targetNode) {
    hStart = haversineDistance(startNode.lat, startNode.lng, targetNode.lat, targetNode.lng);
  }
  
  fScore[startNodeId] = hStart;
  pq.enqueue(startNodeId, hStart);
  exploredSteps.push({ id: startNodeId, type: 'exploring' });

  let targetFound = false;

  while (!pq.isEmpty()) {
    const item = pq.dequeue();
    const currNode = item.val;

    // Since A* can enqueue a node multiple times, skip if already visited
    if (visited.has(currNode)) continue;

    visited.add(currNode);
    exploredSteps.push({ id: currNode, type: 'visited' });

    if (currNode === targetNodeId) {
      targetFound = true;
      break;
    }

    const neighbors = graph[currNode] || [];
    for (const neighbor of neighbors) {
      const neighborId = neighbor.node;
      const weight = neighbor.weight;

      if (visited.has(neighborId)) continue;

      const tentativeGScore = gScore[currNode] + weight;
      if (tentativeGScore < gScore[neighborId]) {
        parents[neighborId] = currNode;
        gScore[neighborId] = tentativeGScore;

        const neighborNode = nodeMap[neighborId];
        let hVal = 0;
        if (neighborNode && targetNode) {
          hVal = haversineDistance(neighborNode.lat, neighborNode.lng, targetNode.lat, targetNode.lng);
        }

        const tentativeFScore = tentativeGScore + hVal;
        fScore[neighborId] = tentativeFScore;
        
        pq.enqueue(neighborId, tentativeFScore);
        exploredSteps.push({ id: neighborId, type: 'exploring', parent: currNode });
      }
    }
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  // Reconstruct path
  const path = [];
  if (targetFound || gScore[targetNodeId] !== Infinity) {
    let curr = targetNodeId;
    while (curr !== null) {
      path.unshift(curr);
      curr = parents[curr];
    }
  }

  return {
    path,
    exploredNodes: exploredSteps,
    distance: gScore[targetNodeId] === Infinity ? 0 : gScore[targetNodeId],
    executionTime
  };
}
