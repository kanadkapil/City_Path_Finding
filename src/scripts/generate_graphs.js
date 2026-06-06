import fs from 'fs';
import path from 'path';

// Generate a precise coordinate layout for New York (rotated grid)
function makeNewYorkGrid() {
  const nodes = [];
  const edges = [];
  const prefix = 'N';

  // Times Square (42nd St & 7th Ave) is our alignment anchor
  const anchorLat = 40.7580;
  const anchorLng = -73.9855;
  const anchorRow = 20;
  const anchorCol = 12;

  // Manhattan block sizes: street spacing ~80m, avenue spacing ~270m
  const streetSpacing = 80; 
  const avenueSpacing = 270;
  
  const numRows = 25;
  const numCols = 40;

  // 29 degrees clockwise from North
  const theta = 29 * Math.PI / 180;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  // Generate nodes
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const idNum = r * numCols + c + 1;
      const id = `${prefix}${idNum}`;

      // Local offsets in meters relative to anchor
      const dy = (r - anchorRow) * streetSpacing;
      const dx = (c - anchorCol) * avenueSpacing;

      // Rotate offsets
      const rotX = dx * cosT + dy * sinT;
      const rotY = -dx * sinT + dy * cosT;

      // Convert to lat/lng
      let lat = anchorLat + rotY / 111000;
      let lng = anchorLng + rotX / 84000;

      lat = Math.round(lat * 100000) / 100000;
      lng = Math.round(lng * 100000) / 100000;

      const label = `NY Intersection (St ${34 + r} & Ave ${12 - Math.floor(c / 2)})`;
      nodes.push({ id, label, lat, lng });
    }
  }

  // Generate edges
  const edgeSet = new Set();
  const addEdge = (u, v) => {
    const key1 = `${u}-${v}`;
    const key2 = `${v}-${u}`;
    if (!edgeSet.has(key1) && !edgeSet.has(key2)) {
      edges.push({ source: u, target: v });
      edgeSet.add(key1);
    }
  };

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const idx = r * numCols + c;
      const uId = `${prefix}${idx + 1}`;

      // Horizontal connection (streets)
      if (c < numCols - 1) {
        addEdge(uId, `${prefix}${idx + 2}`);
      }
      // Vertical connection (avenues)
      if (r < numRows - 1) {
        addEdge(uId, `${prefix}${idx + numCols + 1}`);
      }
    }
  }

  return { city: "New York", center: [anchorLat, anchorLng], nodes, edges };
}

// Generate a precise radial circle layout for Delhi Connaught Place
function makeDelhiGrid() {
  const nodes = [];
  const edges = [];
  const prefix = 'D';

  const centerLat = 28.6304;
  const centerLng = 77.2177;
  const numRows = 25; // rings
  const numCols = 40; // spokes

  const ringSpacingMeters = 80;

  // Generate nodes
  for (let r = 0; r < numRows; r++) {
    const radius = (r + 1) * ringSpacingMeters;
    for (let c = 0; c < numCols; c++) {
      const idNum = r * numCols + c + 1;
      const id = `${prefix}${idNum}`;

      const angle = (c / numCols) * 2 * Math.PI;

      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);

      let lat = centerLat + dy / 111000;
      let lng = centerLng + dx / (111000 * Math.cos(centerLat * Math.PI / 180));

      lat = Math.round(lat * 100000) / 100000;
      lng = Math.round(lng * 100000) / 100000;

      const label = `CP Circle ${r + 1} Spoke ${c + 1}`;
      nodes.push({ id, label, lat, lng });
    }
  }

  // Generate edges
  const edgeSet = new Set();
  const addEdge = (u, v) => {
    const key1 = `${u}-${v}`;
    const key2 = `${v}-${u}`;
    if (!edgeSet.has(key1) && !edgeSet.has(key2)) {
      edges.push({ source: u, target: v });
      edgeSet.add(key1);
    }
  };

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const idx = r * numCols + c;
      const uId = `${prefix}${idx + 1}`;

      // Horizontal connection (circle path)
      const nextColIdx = (c === numCols - 1) ? 0 : c + 1;
      const vIdHoriz = `${prefix}${r * numCols + nextColIdx + 1}`;
      addEdge(uId, vIdHoriz);

      // Vertical connection (radial spoke road)
      if (r < numRows - 1) {
        const vIdVert = `${prefix}${(r + 1) * numCols + c + 1}`;
        addEdge(uId, vIdVert);
      }
    }
  }

  return { city: "Delhi", center: [centerLat, centerLng], nodes, edges };
}

// Generate a precise grid for London winding lanes
function makeLondonGrid() {
  const nodes = [];
  const edges = [];
  const prefix = 'L';

  const centerLat = 51.5110;
  const centerLng = -0.1260;
  const numRows = 25;
  const numCols = 40;

  const latStep = 0.0008;
  const lngStep = 0.0012;

  const startLat = centerLat - (numRows * latStep) / 2;
  const startLng = centerLng - (numCols * lngStep) / 2;

  // Generate nodes
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const idNum = r * numCols + c + 1;
      const id = `${prefix}${idNum}`;

      // Add Thames/Soho wave offset
      const bend = 0.0008 * Math.sin(c * 0.25) + 0.0004 * Math.cos(r * 0.35);
      let lat = startLat + r * latStep + bend;
      let lng = startLng + c * lngStep + bend;

      lat = Math.round(lat * 100000) / 100000;
      lng = Math.round(lng * 100000) / 100000;

      const label = `London Block ${r + 1}-${c + 1}`;
      nodes.push({ id, label, lat, lng });
    }
  }

  // Generate edges
  const edgeSet = new Set();
  const addEdge = (u, v) => {
    const key1 = `${u}-${v}`;
    const key2 = `${v}-${u}`;
    if (!edgeSet.has(key1) && !edgeSet.has(key2)) {
      edges.push({ source: u, target: v });
      edgeSet.add(key1);
    }
  };

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const idx = r * numCols + c;
      const uId = `${prefix}${idx + 1}`;

      // Horizontal connection
      if (c < numCols - 1) {
        addEdge(uId, `${prefix}${idx + 2}`);
      }
      // Vertical connection
      if (r < numRows - 1) {
        addEdge(uId, `${prefix}${idx + numCols + 1}`);
      }
    }
  }

  return { city: "London", center: [centerLat, centerLng], nodes, edges };
}

console.log("Generating precise street-aligned 1000-node network graphs...");

const londonData = makeLondonGrid();
const newyorkData = makeNewYorkGrid();
const delhiData = makeDelhiGrid();

const dataDir = './src/data';
fs.writeFileSync(path.join(dataDir, 'london.json'), JSON.stringify(londonData, null, 2));
fs.writeFileSync(path.join(dataDir, 'newyork.json'), JSON.stringify(newyorkData, null, 2));
fs.writeFileSync(path.join(dataDir, 'delhi.json'), JSON.stringify(delhiData, null, 2));

console.log(`Successfully generated precise files:
  - London: ${londonData.nodes.length} nodes, ${londonData.edges.length} edges
  - New York: ${newyorkData.nodes.length} nodes, ${newyorkData.edges.length} edges
  - Delhi: ${delhiData.nodes.length} nodes, ${delhiData.edges.length} edges
`);
