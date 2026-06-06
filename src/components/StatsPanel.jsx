import React from 'react';

/**
 * StatsPanel component that shows the metrics of the current run
 * and provides a side-by-side comparison of Dijkstra vs A* performance.
 */
export default function StatsPanel({ currentStats, comparisonStats }) {
  const formatDistance = (dist) => {
    if (dist === null || dist === undefined) return '-';
    return `${dist.toFixed(3)} km`;
  };

  const formatTime = (time) => {
    if (time === null || time === undefined) return '-';
    return `${time.toFixed(2)} ms`;
  };

  const formatVal = (val) => {
    return val !== null && val !== undefined ? val : '-';
  };

  // Extract stats for both algorithms to display side-by-side
  const dijkstra = comparisonStats?.dijkstra || null;
  const astar = comparisonStats?.astar || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Current Run Stats Card */}
      <div className="lg:col-span-1 card bg-neutral text-neutral-content shadow-lg border border-gray-800 p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-md text-primary tracking-wider uppercase mb-4 border-b border-gray-800 pb-2">
            Current Run Metrics
          </h3>
          {currentStats ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400 block">Algorithm Used</span>
                <span className="text-lg font-bold text-white uppercase">{currentStats.algorithm}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 block">Shortest Distance</span>
                  <span className="text-xl font-extrabold text-secondary">
                    {formatDistance(currentStats.distance)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Execution Time</span>
                  <span className="text-xl font-extrabold text-accent">
                    {formatTime(currentStats.executionTime)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Nodes Explored</span>
                  <span className="text-xl font-extrabold text-warning">
                    {formatVal(currentStats.nodesExplored)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Path Length</span>
                  <span className="text-xl font-extrabold text-info">
                    {formatVal(currentStats.pathLength)} nodes
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm italic">
              Select Start & Destination nodes and click "Run Algorithm" to see metrics.
            </div>
          )}
        </div>
      </div>

      {/* Comparison Panel */}
      <div className="lg:col-span-2 card bg-neutral text-neutral-content shadow-lg border border-gray-800 p-5">
        <h3 className="font-bold text-md text-primary tracking-wider uppercase mb-4 border-b border-gray-800 pb-2">
          Algorithm Performance Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-xs">
                <th>Metric</th>
                <th>Dijkstra</th>
                <th>A* Search</th>
                <th>Comparison / Winner</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="font-bold text-gray-300">Shortest Distance</td>
                <td className="text-secondary">{formatDistance(dijkstra?.distance)}</td>
                <td className="text-secondary">{formatDistance(astar?.distance)}</td>
                <td>
                  {dijkstra && astar ? (
                    Math.abs(dijkstra.distance - astar.distance) < 0.0001 ? (
                      <span className="badge badge-success badge-sm gap-1">Optimal Path Found (Tie)</span>
                    ) : (
                      <span className="badge badge-warning badge-sm">Slight variance due to rounding</span>
                    )
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="font-bold text-gray-300">Nodes Explored</td>
                <td className="text-warning">{formatVal(dijkstra?.nodesExplored)}</td>
                <td className="text-warning">{formatVal(astar?.nodesExplored)}</td>
                <td>
                  {dijkstra && astar ? (
                    dijkstra.nodesExplored === astar.nodesExplored ? (
                      <span className="text-gray-400 text-xs">Equal exploration</span>
                    ) : dijkstra.nodesExplored > astar.nodesExplored ? (
                      <span className="badge badge-success badge-outline badge-sm">
                        A* explored {dijkstra.nodesExplored - astar.nodesExplored} fewer nodes
                      </span>
                    ) : (
                      <span className="badge badge-success badge-outline badge-sm">
                        Dijkstra explored {astar.nodesExplored - dijkstra.nodesExplored} fewer nodes
                      </span>
                    )
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="font-bold text-gray-300">Execution Time</td>
                <td className="text-accent">{formatTime(dijkstra?.executionTime)}</td>
                <td className="text-accent">{formatTime(astar?.executionTime)}</td>
                <td>
                  {dijkstra && astar ? (
                    dijkstra.executionTime > astar.executionTime ? (
                      <span className="text-green-400 text-xs font-bold">
                        A* was {(dijkstra.executionTime / astar.executionTime).toFixed(1)}x faster
                      </span>
                    ) : (
                      <span className="text-green-400 text-xs font-bold">
                        Dijkstra was {(astar.executionTime / dijkstra.executionTime).toFixed(1)}x faster
                      </span>
                    )
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="font-bold text-gray-300">Path Length</td>
                <td className="text-info">{formatVal(dijkstra?.pathLength)} nodes</td>
                <td className="text-info">{formatVal(astar?.pathLength)} nodes</td>
                <td>
                  {dijkstra && astar ? (
                    dijkstra.pathLength === astar.pathLength ? (
                      <span className="text-gray-400 text-xs">Identical hop counts</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Different path structure</span>
                    )
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {dijkstra && astar && (
          <div className="mt-4 p-3 bg-base-100 rounded-lg text-xs border border-gray-800 text-gray-300 flex items-start gap-2 leading-relaxed">
            <span className="text-yellow-500 font-bold">💡 Learning Note:</span>
            <span>
              A* uses a heuristic (Haversine distance to goal) to guide its search, resulting in fewer nodes explored and faster execution on spatial networks. Dijkstra explores uniformly in all directions, acting as a blind search. Both are guaranteed to find the absolute shortest path if heuristics are admissible.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
