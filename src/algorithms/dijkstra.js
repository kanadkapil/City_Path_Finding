import { PriorityQueue } from './priorityQueue.js';

/**
 * Dijkstra's shortest path algorithm.
 * 
 * @param {Object} graph - The adjacency list of the graph: { nodeId: [ { node: neighborId, weight } ] }
 * @param {string} startNodeId - Starting node ID
 * @param {string} targetNodeId - Target destination node ID
 * @returns {Object} { path, exploredNodes, distance, executionTime }
 */
export function dijkstra(graph, startNodeId, targetNodeId) {
  const startTime = performance.now();

  const distances = {};
  const parents = {};
  const visited = new Set();
  const pq = new PriorityQueue();
  const exploredSteps = []; // Recorded steps for step-by-step animation

  // Initialize distances
  Object.keys(graph).forEach(nodeId => {
    distances[nodeId] = Infinity;
    parents[nodeId] = null;
  });

  distances[startNodeId] = 0;
  pq.enqueue(startNodeId, 0);
  exploredSteps.push({ id: startNodeId, type: 'exploring' });

  let targetFound = false;

  while (!pq.isEmpty()) {
    const item = pq.dequeue();
    const currNode = item.val;
    const currDist = item.priority;

    // If we've found a shorter path to this node already, skip it
    if (currDist > distances[currNode]) continue;

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

      const newDist = distances[currNode] + weight;
      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
        parents[neighborId] = currNode;
        pq.enqueue(neighborId, newDist);
        exploredSteps.push({ id: neighborId, type: 'exploring', parent: currNode });
      }
    }
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  // Reconstruct path
  const path = [];
  if (targetFound || distances[targetNodeId] !== Infinity) {
    let curr = targetNodeId;
    while (curr !== null) {
      path.unshift(curr);
      curr = parents[curr];
    }
  }

  return {
    path,
    exploredNodes: exploredSteps,
    distance: distances[targetNodeId] === Infinity ? 0 : distances[targetNodeId],
    executionTime
  };
}
