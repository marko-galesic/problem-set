const DEFAULT_OPTIONS = {
  columnWidth: 260,
  rowHeight: 90,
  paddingX: 40,
  paddingY: 48,
  nodeRadius: 18,
  layoutMode: 'depth'
};

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeDifficulty(value) {
  if (typeof value !== 'string') {
    return 'unknown';
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return 'unknown';
}

function buildPrerequisiteMap(edges, nodesById) {
  const prereqMap = new Map();
  for (const edge of edges || []) {
    if (!edge || !edge.from || !edge.to) {
      continue;
    }
    if (!nodesById.has(edge.from) || !nodesById.has(edge.to)) {
      continue;
    }
    if (!prereqMap.has(edge.to)) {
      prereqMap.set(edge.to, []);
    }
    prereqMap.get(edge.to).push(edge.from);
  }
  return prereqMap;
}

function computeDepths(nodes, edges) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const prereqMap = buildPrerequisiteMap(edges, nodesById);
  const depthMemo = new Map();
  const visiting = new Set();

  const getDepth = (id) => {
    if (depthMemo.has(id)) {
      return depthMemo.get(id);
    }
    if (visiting.has(id)) {
      return 0;
    }
    visiting.add(id);
    const prereqs = prereqMap.get(id) || [];
    let depth = 0;
    for (const prereqId of prereqs) {
      depth = Math.max(depth, getDepth(prereqId) + 1);
    }
    visiting.delete(id);
    depthMemo.set(id, depth);
    return depth;
  };

  const depths = new Map();
  for (const node of nodes) {
    depths.set(node.id, getDepth(node.id));
  }
  return { depths, prereqMap };
}

function buildDepthColumns(nodes, edges, options) {
  const { depths } = computeDepths(nodes, edges);
  const columns = new Map();
  for (const node of nodes) {
    const depth = depths.get(node.id) || 0;
    if (!columns.has(depth)) {
      columns.set(depth, []);
    }
    columns.get(depth).push(node);
  }
  const orderedDepths = Array.from(columns.keys()).sort((a, b) => a - b);
  return { columns, orderedDepths };
}

function buildDifficultyColumns(nodes) {
  const order = ['easy', 'medium', 'hard', 'unknown'];
  const columns = new Map(order.map((key) => [key, []]));
  for (const node of nodes) {
    const difficulty = normalizeDifficulty(node.difficulty);
    columns.get(difficulty).push(node);
  }
  return { columns, orderedDepths: order };
}

function sortColumnNodes(column) {
  return column.sort((a, b) => {
    if (Boolean(a.hasSubmission) !== Boolean(b.hasSubmission)) {
      return a.hasSubmission ? -1 : 1;
    }
    return String(a.name || a.id).localeCompare(String(b.name || b.id));
  });
}

function buildGraphLayout(nodesInput = [], edgesInput = [], options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const nodes = Array.isArray(nodesInput)
    ? nodesInput.map((node) => ({
      ...node,
      difficulty: normalizeDifficulty(node.difficulty)
    }))
    : [];
  const edges = Array.isArray(edgesInput) ? edgesInput : [];

  if (nodes.length === 0) {
    return {
      nodes: [],
      edges: [],
      positions: new Map(),
      width: 0,
      height: 0,
      columns: [],
      nodeRadius: opts.nodeRadius
    };
  }

  const layoutMode = opts.layoutMode === 'difficulty' ? 'difficulty' : 'depth';
  const { columns, orderedDepths } = layoutMode === 'difficulty'
    ? buildDifficultyColumns(nodes)
    : buildDepthColumns(nodes, edges, opts);

  const positions = new Map();
  let maxRows = 0;

  orderedDepths.forEach((columnKey, columnIndex) => {
    const group = columns.get(columnKey) || [];
    const sorted = sortColumnNodes(group);
    maxRows = Math.max(maxRows, sorted.length);
    sorted.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: opts.paddingX + columnIndex * opts.columnWidth,
        y: opts.paddingY + rowIndex * opts.rowHeight
      });
    });
  });

  const width = opts.paddingX * 2
    + opts.columnWidth * Math.max(0, orderedDepths.length - 1)
    + 260;
  const height = opts.paddingY * 2 + Math.max(1, maxRows) * opts.rowHeight;

  return {
    nodes,
    edges,
    positions,
    width,
    height,
    columns: orderedDepths,
    nodeRadius: opts.nodeRadius
  };
}

function buildGraphEdgePath(from, to) {
  const dx = to.x - from.x;
  const curve = Math.max(40, Math.abs(dx) * 0.35);
  const controlX1 = from.x + (dx >= 0 ? curve : -curve);
  const controlX2 = to.x - (dx >= 0 ? curve : -curve);
  return `M ${from.x} ${from.y} C ${controlX1} ${from.y}, ${controlX2} ${to.y}, ${to.x} ${to.y}`;
}

function computeFitTransform({ width, height, containerWidth, containerHeight, padding = 20 }) {
  if (!width || !height || !containerWidth || !containerHeight) {
    return { scale: 1, x: 0, y: 0 };
  }
  const availableWidth = Math.max(1, containerWidth - padding * 2);
  const availableHeight = Math.max(1, containerHeight - padding * 2);
  const scaleX = availableWidth / width;
  const scaleY = availableHeight / height;
  const scale = clampValue(Math.min(scaleX, scaleY, 1), 0.4, 2.5);
  const x = (containerWidth - width * scale) / 2;
  const y = (containerHeight - height * scale) / 2;
  return { scale, x, y };
}

export {
  DEFAULT_OPTIONS,
  buildGraphLayout,
  buildGraphEdgePath,
  computeFitTransform,
  normalizeDifficulty
};
