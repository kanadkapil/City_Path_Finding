/**
 * fetch_osm_data.js
 * 
 * Fetches real street intersection nodes from OpenStreetMap via the Overpass API
 * for a precise 4x4km bounding box in London, New York, and Delhi.
 * 
 * Nodes = real street intersections
 * Edges = real road segments connecting intersections
 */

import fs from 'fs';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// 4x4 km bounding boxes (south, west, north, east)
// Centered on iconic, dense street areas
const CITIES = [
  {
    name: 'London',
    prefix: 'L',
    // Central London: Westminster to Fleet Street, Embankment to Holborn
    bbox: [51.4980, -0.1450, 51.5220, -0.0990],
    center: [51.5100, -0.1220],
    outFile: './src/data/london.json'
  },
  {
    name: 'New York',
    prefix: 'N',
    // Midtown Manhattan: 28th St to 57th St, 9th Ave to 3rd Ave
    bbox: [40.7400, -74.0030, 40.7670, -73.9660],
    center: [40.7535, -73.9845],
    outFile: './src/data/newyork.json'
  },
  {
    name: 'Delhi',
    prefix: 'D',
    // Central Delhi: Connaught Place, Janpath, India Gate, Khan Market
    bbox: [28.5960, 77.1950, 28.6450, 77.2450],
    center: [28.6205, 77.2200],
    outFile: './src/data/delhi.json'
  }
];

/**
 * Build an Overpass QL query that retrieves:
 * - All highway=* ways (road segments) within the bounding box
 * - Their constituent nodes (street intersections)
 * Filters out motorways, footways, and paths to keep drivable streets
 */
function buildQuery(bbox) {
  const [s, w, n, e] = bbox;
  return `
[out:json][timeout:60];
(
  way["highway"~"^(primary|secondary|tertiary|residential|unclassified|trunk)$"]
    (${s},${w},${n},${e});
);
out body;
>;
out skel qt;
`.trim();
}

/**
 * Fetch data from Overpass API
 */
async function fetchOverpass(query) {
  const body = new URLSearchParams();
  body.append('data', query);

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'CityPathVisualizer/1.0 (educational project)'
    },
    body: body.toString()
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Overpass API error: ${response.status} ${response.statusText}\n${text.slice(0,300)}`);
  }
  
  return response.json();
}

/**
 * Parse OSM data and build a graph of intersections + edges
 * Strategy:
 *  1. Find all nodes that appear in 2+ ways (those are intersections)
 *  2. For each way, connect consecutive nodes that are intersections
 *  3. Limit to ~1000 nodes maximum
 */
function parseOSMToGraph(osmData, prefix, maxNodes = 2500) {
  const elements = osmData.elements;
  
  // Separate nodes and ways — store all IDs as STRINGS for consistent lookups
  const osmNodes = {}; // string id -> {lat, lng}
  const ways = [];    // array of string id arrays

  for (const el of elements) {
    if (el.type === 'node') {
      osmNodes[String(el.id)] = { lat: el.lat, lng: el.lon };
    } else if (el.type === 'way' && el.nodes) {
      // Convert all node ids in this way to strings
      ways.push(el.nodes.map(n => String(n)));
    }
  }

  console.log(`  OSM nodes: ${Object.keys(osmNodes).length}, ways: ${ways.length}`);

  // Count how many ways each node participates in
  const nodeWayCount = {};
  for (const way of ways) {
    for (const nodeId of way) {
      nodeWayCount[nodeId] = (nodeWayCount[nodeId] || 0) + 1;
    }
    // Always count endpoints of each way as intersections
    if (way.length > 0) {
      nodeWayCount[way[0]] = (nodeWayCount[way[0]] || 0) + 1;
      nodeWayCount[way[way.length - 1]] = (nodeWayCount[way[way.length - 1]] || 0) + 1;
    }
  }
  
  // Collect intersection nodes (appearing in 2+ ways, with known coordinates)
  const intersectionIds = new Set(
    Object.entries(nodeWayCount)
      .filter(([id, count]) => count >= 2 && osmNodes[id])
      .map(([id]) => id)
  );
  
  console.log(`  Intersections: ${intersectionIds.size}`);

  // Build ALL edges between intersection nodes by walking each way
  const rawEdgeSet = new Set();
  const rawEdges = [];
  const adj = {}; // adjacency list: node -> array of neighbors

  const addRawEdge = (a, b) => {
    if (a === b) return;
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (!rawEdgeSet.has(key)) {
      rawEdgeSet.add(key);
      rawEdges.push([a, b]);
      if (!adj[a]) adj[a] = [];
      if (!adj[b]) adj[b] = [];
      adj[a].push(b);
      adj[b].push(a);
    }
  };

  for (const way of ways) {
    let lastIntersection = null;
    for (const nodeId of way) {
      if (intersectionIds.has(nodeId)) {
        if (lastIntersection !== null) {
          addRawEdge(lastIntersection, nodeId);
        }
        lastIntersection = nodeId;
      }
    }
  }

  console.log(`  Raw edges: ${rawEdges.length}`);

  // Find the node with the highest degree to start our BFS
  let startNode = null;
  let maxDegree = -1;
  for (const node of intersectionIds) {
    const deg = adj[node] ? adj[node].length : 0;
    if (deg > maxDegree) {
      maxDegree = deg;
      startNode = node;
    }
  }

  // Use BFS to collect exactly maxNodes connected nodes, radiating outward
  const connectedNodes = [];
  const visited = new Set();
  
  if (startNode) {
    const queue = [startNode];
    visited.add(startNode);

    while (queue.length > 0 && connectedNodes.length < maxNodes) {
      const u = queue.shift();
      connectedNodes.push(u);

      if (adj[u]) {
        // Sort neighbors by degree to prioritize busier intersections
        const neighbors = [...adj[u]].sort((a, b) => (adj[b]?.length || 0) - (adj[a]?.length || 0));
        for (const v of neighbors) {
          if (!visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
        }
      }
    }
  }

  const selectedSet = new Set(connectedNodes);

  // Build our id mapping: osm string id -> prefixed id (L1, N1, D1...)
  const idMap = {};
  connectedNodes.forEach((osmId, index) => {
    idMap[osmId] = `${prefix}${index + 1}`;
  });

  // Build final node array with readable labels
  const cityName = prefix === 'L' ? 'London' : prefix === 'N' ? 'New York' : 'Delhi';
  const nodes = connectedNodes.map((osmId, index) => ({
    id: `${prefix}${index + 1}`,
    label: `${cityName} Intersection ${index + 1}`,
    lat: Math.round(osmNodes[osmId].lat * 100000) / 100000,
    lng: Math.round(osmNodes[osmId].lng * 100000) / 100000
  }));

  // Filter raw edges to only those between selected nodes
  const edgeSet = new Set();
  const edges = [];
  for (const [a, b] of rawEdges) {
    if (selectedSet.has(a) && selectedSet.has(b)) {
      const ua = idMap[a];
      const ub = idMap[b];
      const key = ua < ub ? `${ua}|${ub}` : `${ub}|${ua}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ source: ua, target: ub });
      }
    }
  }
  
  console.log(`  Final: ${nodes.length} nodes, ${edges.length} edges`);
  return { nodes, edges };
}

/**
 * Main execution
 */
async function main() {
  console.log('🗺️  Fetching real street data from OpenStreetMap...\n');
  
  for (const city of CITIES) {
    console.log(`📍 Processing ${city.name}...`);
    console.log(`   BBox: ${city.bbox.join(', ')}`);
    
    try {
      const query = buildQuery(city.bbox);
      console.log('   Querying Overpass API...');
      const osmData = await fetchOverpass(query);
      
      console.log(`   Raw OSM elements: ${osmData.elements.length}`);
      
      const { nodes, edges } = parseOSMToGraph(osmData, city.prefix, 2500);
      
      const output = {
        city: city.name,
        center: city.center,
        nodes,
        edges
      };
      
      fs.writeFileSync(city.outFile, JSON.stringify(output, null, 2));
      console.log(`   ✅ Saved to ${city.outFile}\n`);
      
      // Delay between requests to be polite to the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (err) {
      console.error(`   ❌ Error processing ${city.name}: ${err.message}`);
    }
  }
  
  console.log('✅ Done! All city graphs generated from real OSM data.');
}

main().catch(console.error);
