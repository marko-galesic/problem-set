import { describe, test, expect } from '@jest/globals';
import { mkdir, stat } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { buildGraphLayout, buildGraphEdgePath } from '../../../frontend/src/utils/challengeGraphLayout.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '../../../');
const OUTPUT_PATH = resolve(ROOT_DIR, 'logs', 'challenge-graph.jpg');
const SHOULD_RUN = process.env.GRAPH_SNAPSHOT === '1';
const GRAPH_DB_PATH = process.env.GRAPH_DB_PATH;

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSnapshotGraph({ challenges, edges, submissionCounts }) {
  const submissionCountsMap = new Map(
    (submissionCounts || []).map((row) => [row.challenge_id, row.count])
  );
  const submittedIds = new Set(
    Array.from(submissionCountsMap.entries())
      .filter(([, count]) => Number(count) > 0)
      .map(([challengeId]) => challengeId)
  );

  const prereqMap = new Map();
  for (const edge of edges) {
    if (!prereqMap.has(edge.to)) {
      prereqMap.set(edge.to, []);
    }
    prereqMap.get(edge.to).push(edge.from);
  }

  const includedIds = new Set(submittedIds);
  const stack = Array.from(submittedIds);
  while (stack.length > 0) {
    const current = stack.pop();
    const prereqs = prereqMap.get(current) || [];
    for (const prereqId of prereqs) {
      if (!includedIds.has(prereqId)) {
        includedIds.add(prereqId);
        stack.push(prereqId);
      }
    }
  }

  const nodes = challenges
    .filter((challenge) => includedIds.has(challenge.id))
    .map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      difficulty: challenge.difficulty ?? 'unknown',
      hasSubmission: submissionCountsMap.has(challenge.id),
      submissionCount: submissionCountsMap.get(challenge.id) ?? 0
    }));

  const filteredEdges = edges.filter(
    (edge) => includedIds.has(edge.from) && includedIds.has(edge.to)
  );

  return { nodes, edges: filteredEdges };
}

function buildGraphSvg({ nodes, edges, layoutOptions, meta }) {
  const layout = buildGraphLayout(nodes, edges, layoutOptions);
  const margin = 48;
  const rawWidth = layout.width + margin * 2;
  const rawHeight = layout.height + margin * 2;
  const maxDimension = 24000;
  const scale = Math.min(1, maxDimension / rawWidth, maxDimension / rawHeight);
  const width = Math.max(1, Math.floor(rawWidth * scale));
  const height = Math.max(1, Math.floor(rawHeight * scale));

  const columnLabels = layout.columns.map((depthValue, index) => ({
    label: `Depth ${depthValue}`,
    x: layoutOptions.paddingX + index * layoutOptions.columnWidth,
    y: Math.max(24, layoutOptions.paddingY - 18)
  }));

  const edgesMarkup = edges
    .map((edge) => {
      const from = layout.positions.get(edge.from);
      const to = layout.positions.get(edge.to);
      if (!from || !to) {
        return '';
      }
      return `<path d="${buildGraphEdgePath(from, to)}" class="edge" />`;
    })
    .join('\n');

  const nodesMarkup = nodes
    .map((node) => {
      const position = layout.positions.get(node.id);
      if (!position) {
        return '';
      }
      const nodeClass = node.hasSubmission ? 'node submitted' : 'node ancestor';
      return `
      <g class="${nodeClass}">
        <circle cx="${position.x}" cy="${position.y}" r="${layout.nodeRadius}" />
        <text x="${position.x + layout.nodeRadius + 10}" y="${position.y + 4}">${escapeText(node.name)}</text>
      </g>`;
    })
    .join('\n');

  const labelsMarkup = columnLabels
    .map((label) => `<text x="${label.x}" y="${label.y}" class="column">${escapeText(label.label)}</text>`)
    .join('\n');

  const title = escapeText(meta.title || 'Challenge Graph Snapshot');
  const subtitle = escapeText(meta.subtitle || 'Submitted challenges with prerequisite ancestry');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${rawWidth} ${rawHeight}">
  <defs>
    <style>
      .title { font: 700 20px sans-serif; fill: #0f172a; }
      .subtitle { font: 12px sans-serif; fill: #475569; }
      .column { font: 600 12px sans-serif; fill: #1d4ed8; letter-spacing: 0.4px; }
      .edge { fill: none; stroke: rgba(29, 78, 216, 0.22); stroke-width: 2; }
      .node circle { stroke-width: 2; }
      .node.submitted circle { fill: #1d4ed8; stroke: #1e3a8a; }
      .node.ancestor circle { fill: #e0e7ff; stroke: #94a3b8; }
      .node text { font: 12px sans-serif; fill: #111827; }
      .node.ancestor text { fill: #4b5563; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <g transform="translate(${margin} ${margin})">
    <text x="0" y="0" class="title">${title}</text>
    <text x="0" y="20" class="subtitle">${subtitle}</text>
    <g transform="translate(0 30)">
      ${labelsMarkup}
      ${edgesMarkup}
      ${nodesMarkup}
    </g>
  </g>
</svg>`;
}

describe('Challenge graph snapshot', () => {
  const runTest = SHOULD_RUN ? test : test.skip;
  runTest('writes a jpg snapshot from submission history', async () => {
    if (GRAPH_DB_PATH) {
      process.env.CHALLENGES_DB_PATH = GRAPH_DB_PATH;
    }
    const dbModule = await import('../db/database.js');
    const queriesModule = await import('../db/queries.js');
    const { initDatabase, closeDatabase, getDatabase } = dbModule;
    const {
      getAllChallenges,
      getPrerequisiteEdges,
      getSubmissionCountsByChallenge
    } = queriesModule;

    initDatabase();
    try {
      let language = typeof process.env.GRAPH_LANGUAGE === 'string'
        ? process.env.GRAPH_LANGUAGE
        : 'java';
      const challenges = getAllChallenges();
      const edges = getPrerequisiteEdges().map((edge) => ({
        from: edge.prerequisite_id,
        to: edge.challenge_id,
        type: 'prerequisite'
      }));
      let submissionCounts = getSubmissionCountsByChallenge(language);
      if (submissionCounts.length === 0) {
        const db = getDatabase();
        const rows = db.prepare(`
          SELECT LOWER(language) as language, COUNT(*) as count
          FROM submissions
          GROUP BY LOWER(language)
          ORDER BY count DESC
        `).all();
        if (rows.length > 0) {
          language = rows[0].language;
          submissionCounts = getSubmissionCountsByChallenge(language);
        }
      }
      const graphData = buildSnapshotGraph({
        challenges,
        edges,
        submissionCounts
      });
      expect(Array.isArray(graphData.nodes)).toBe(true);
      expect(graphData.nodes.length).toBeGreaterThan(0);

      const layoutOptions = {
        layoutMode: 'depth',
        columnWidth: 320,
        rowHeight: 100,
        paddingX: 80,
        paddingY: 80,
        nodeRadius: 20
      };

      const svg = buildGraphSvg({
        nodes: graphData.nodes,
        edges: graphData.edges,
        layoutOptions,
        meta: {
          title: 'Challenge Graph Snapshot',
          subtitle: `Language: ${language} · Nodes: ${graphData.nodes.length} · Edges: ${graphData.edges.length}`
        }
      });

      await mkdir(dirname(OUTPUT_PATH), { recursive: true });
      await sharp(Buffer.from(svg))
        .jpeg({ quality: 92 })
        .toFile(OUTPUT_PATH);

      const info = await stat(OUTPUT_PATH);
      expect(info.size).toBeGreaterThan(0);
    } finally {
      closeDatabase();
    }
  }, 180000);
});
