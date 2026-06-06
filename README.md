# 🗺️ CityPath Visualizer

CityPath Visualizer is an interactive, high-performance GIS application that visualizes graph theory pathfinding algorithms (**Dijkstra's Algorithm** and **A\* Search**) on real-world street networks of **London**, **New York City**, and **New Delhi**.

Built with **React 19**, **Leaflet**, and **Tailwind CSS + DaisyUI**, the app allows CS students, GIS learners, and developers to explore how algorithms navigate complex urban routing spaces. It provides a real-time visualization of algorithmic frontiers and demonstrates how obstacles (roadblocks) and traffic congestion dynamically alter optimal paths.

---

## 🚀 Features

- **Real OpenStreetMap Networks**: Features massive city graphs with **2,500 interconnected street intersections** and thousands of roads, extracted directly from OSM data.
- **Dynamic Node Selection**: Place Start (📍 **Cyan**) and Destination (📍 **Pink**) markers instantly by clicking any intersection on the network.
- **Dynamic Graph Modifiers**:
  - **🚧 Blocked Roads**: Click a road to block it, forcing algorithms to recalculate long detours.
  - **🚗 Heavy Traffic**: Mark roads as congested to increase traversal cost (2.5x distance penalty), visualizing how paths adapt to bypass traffic.
  - **🎲 Randomize Obstacles**: Automatically generate a realistic layer of blockages and traffic across the city grid.
- **Live Search Animations**: Watch the pathfinding process expand across the grid step-by-step:
  - 🔵 **Blue**: Exploring frontier (nodes actively in the priority queue).
  - 🟣 **Purple**: Visited nodes and traversed edges.
  - 🥇 **Gold/Amber**: The final computed shortest path.
- **Performance Comparisons**: A side-by-side stats dashboard tracking:
  - Path Distance (km)
  - Number of Nodes Explored
  - Execution Time (ms)
  - Hop Count (number of road segments)

---

## 📂 Project Structure

```txt
citypath-visualizer/
├── src/
│   ├── algorithms/
│   │   ├── dijkstra.js         # Dijkstra algorithm implementation
│   │   ├── astar.js            # A* search algorithm using Haversine heuristic
│   │   └── priorityQueue.js    # Optimized Binary Min-Heap Priority Queue
│   │
│   ├── components/
│   │   ├── MapView.jsx         # React-Leaflet map rendering ~2,500 nodes & edges
│   │   ├── ControlPanel.jsx    # UI controls (algorithms, map modes, animation speed)
│   │   ├── StatsPanel.jsx      # Performance statistics comparison dashboard
│   │   └── Legend.jsx          # Map element color key
│   │
│   ├── data/
│   │   ├── london.json         # Real OSM data: 2500 nodes, central London
│   │   ├── newyork.json        # Real OSM data: Manhattan intersections
│   │   └── delhi.json          # Real OSM data: Central New Delhi intersections
│   │
│   ├── hooks/
│   │   ├── useMapState.js      # Custom hook managing user interaction state
│   │   └── usePathfinding.js   # Custom hook managing async visualization and graph state
│   │
│   ├── scripts/
│   │   └── fetch_osm_data.js   # Node.js script querying Overpass API to rebuild city graphs
│   │
│   ├── utils/
│   │   ├── graphBuilder.js     # Adjacency list constructor supporting traffic & roadblocks
│   │   └── haversineDistance.js# Great-circle GPS distance formula calculator
│   │
│   ├── pages/
│   │   └── Home.jsx            # Main app container assembling layout components
│   │
│   ├── index.css               # Core CSS & Tailwind imports
│   ├── App.jsx                 # Application entry layout
│   └── main.jsx                # React mount point
```

---

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed.

1. **Navigate to the Project Directory**:
   ```bash
   cd citypath-visualizer
   ```

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: `--legacy-peer-deps` is used because React-Leaflet's peer dependencies default to React 18, while this project utilizes React 19).*

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

4. **Production Build**:
   ```bash
   npm run build
   ```

### 🌍 Generating New Map Data
You can query the Overpass API directly to update or generate new graphs using the backend script:
```bash
npm run fetch-data
```
This runs `src/scripts/fetch_osm_data.js`, resolving exact coordinates and generating mathematically connected sub-graphs.

---

## 🧠 Algorithm Explanations

### 1. Dijkstra's Algorithm
Dijkstra's is a **uniform-cost search** that finds the shortest path between nodes in a weighted graph.
- **Heuristic**: None (blind search). It expands equally in all radial directions from the starting node.
- **Optimality**: Guaranteed to find the absolute shortest path on graphs with non-negative weights.
- **Visual Frontier**: Expands as a massive radial wave across the city, exploring almost every street before reaching the destination.

### 2. A\* Search Algorithm
A\* is an **informed search** that uses spatial heuristics to optimize navigation towards the target node.
- **Heuristic**: Great-circle **Haversine Distance** between the current node and the target node coordinates. Because a straight line is mathematically shorter than or equal to the actual road layout, the heuristic is *admissible* (never overestimates) and *consistent*.
- **Formula**:
  $$f(n) = g(n) + h(n)$$
  Where:
  - $g(n)$: Actual distance traveled from the start node to node $n$.
  - $h(n)$: Estimated (Haversine) distance from $n$ to the target.
- **Visual Frontier**: Directs its search path in a highly focused cone towards the destination, exploring significantly fewer nodes and executing much faster than Dijkstra.
