import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { initDatabase } from './database.js';
import {
  insertChallengeIfMissing,
  upsertChallengeAdapterDefinition,
  upsertChallengeAsset,
  replaceChallengeTestCases
} from './queries.js';

const __filename = fileURLToPath(import.meta.url);

const DB_ONLY_CHALLENGES = [
  { id: 'add_eleven', name: 'Add Eleven', op: 'add', k: 11 },
  { id: 'add_twelve', name: 'Add Twelve', op: 'add', k: 12 },
  { id: 'add_thirteen', name: 'Add Thirteen', op: 'add', k: 13 },
  { id: 'add_fourteen', name: 'Add Fourteen', op: 'add', k: 14 },
  { id: 'add_fifteen', name: 'Add Fifteen', op: 'add', k: 15 },
  { id: 'subtract_eleven', name: 'Subtract Eleven', op: 'subtract', k: 11 },
  { id: 'subtract_twelve', name: 'Subtract Twelve', op: 'subtract', k: 12 },
  { id: 'subtract_thirteen', name: 'Subtract Thirteen', op: 'subtract', k: 13 },
  { id: 'subtract_fourteen', name: 'Subtract Fourteen', op: 'subtract', k: 14 },
  { id: 'subtract_fifteen', name: 'Subtract Fifteen', op: 'subtract', k: 15 },
  { id: 'multiply_by_thirteen', name: 'Multiply By Thirteen', op: 'multiply', k: 13 },
  { id: 'multiply_by_fourteen', name: 'Multiply By Fourteen', op: 'multiply', k: 14 },
  { id: 'multiply_by_fifteen', name: 'Multiply By Fifteen', op: 'multiply', k: 15 },
  { id: 'divide_by_seven', name: 'Divide By Seven', op: 'divide', k: 7 },
  { id: 'divide_by_eight', name: 'Divide By Eight', op: 'divide', k: 8 },
  { id: 'divide_by_nine', name: 'Divide By Nine', op: 'divide', k: 9 },
  { id: 'divide_by_ten', name: 'Divide By Ten', op: 'divide', k: 10 },
  { id: 'divide_by_eleven', name: 'Divide By Eleven', op: 'divide', k: 11 },
  { id: 'square_plus_four', name: 'Square Plus Four', op: 'square_plus', k: 4 },
  { id: 'square_plus_five', name: 'Square Plus Five', op: 'square_plus', k: 5 },
  { id: 'square_plus_six', name: 'Square Plus Six', op: 'square_plus', k: 6 },
  { id: 'square_minus_four', name: 'Square Minus Four', op: 'square_minus', k: 4 },
  { id: 'square_minus_five', name: 'Square Minus Five', op: 'square_minus', k: 5 },
  { id: 'square_minus_six', name: 'Square Minus Six', op: 'square_minus', k: 6 },
  { id: 'cube_plus_three', name: 'Cube Plus Three', op: 'cube_plus', k: 3 }
];

const LANGUAGE_CONFIGS = [
  { language: 'java', template: buildJavaTemplate, golden: buildJavaGolden },
  { language: 'python', template: buildPythonTemplate, golden: buildPythonGolden },
  { language: 'javascript', template: buildJavaScriptTemplate, golden: buildJavaScriptGolden },
  { language: 'typescript', template: buildTypeScriptTemplate, golden: buildTypeScriptGolden }
];

function toPascalCase(value) {
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function buildExpression(op, k, language) {
  if (op === 'add') return `n + ${k}`;
  if (op === 'subtract') return `n - ${k}`;
  if (op === 'multiply') return `n * ${k}`;
  if (op === 'divide') {
    if (language === 'python') return `int(n / ${k})`;
    if (language === 'javascript' || language === 'typescript') return `Math.trunc(n / ${k})`;
    return `n / ${k}`;
  }
  if (op === 'square_plus') return `n * n + ${k}`;
  if (op === 'square_minus') return `n * n - ${k}`;
  if (op === 'cube_plus') return `n * n * n + ${k}`;
  return 'n';
}

function buildDescription({ op, k, methodName }) {
  const operationText = {
    add: `n + ${k}`,
    subtract: `n - ${k}`,
    multiply: `n * ${k}`,
    divide: `n / ${k} using integer division`,
    square_plus: `n * n + ${k}`,
    square_minus: `n * n - ${k}`,
    cube_plus: `n * n * n + ${k}`
  }[op];

  const requirements = ['<li>Return the computed value.</li>'];
  if (op === 'divide') {
    requirements.push('<li>Use integer division (truncate toward zero).</li>');
    requirements.push('<li>The input may be negative.</li>');
  } else if (op === 'add' || op === 'subtract' || op === 'multiply') {
    requirements.push('<li>The input may be negative.</li>');
  }

  const exampleOutput = computeExpected(op, 0, k);

  return `<p>\n  Given an integer n, return ${operationText}.\n</p>\n\n<h3>Method Signature</h3>\n<pre><code>public int ${methodName}(int n)</code></pre>\n\n<h3>Requirements</h3>\n<ul>\n  ${requirements.join('\n  ')}\n</ul>\n\n<h3>Example</h3>\n<p><strong>Input:</strong></p>\n<pre><code>n = 0\n</code></pre>\n\n<p><strong>Output:</strong></p>\n<pre><code>${exampleOutput}\n</code></pre>\n`;
}

function buildJavaTemplate(className, methodName) {
  return `class ${className} {\n    public int ${methodName}(int n) {\n        return 0;\n    }\n}\n`;
}

function buildJavaGolden(className, methodName, expression) {
  return `class ${className} {\n    public int ${methodName}(int n) {\n        return ${expression};\n    }\n}\n`;
}

function buildPythonTemplate(className, methodName) {
  return `class ${className}:\n    def ${methodName}(self, n):\n        return 0\n`;
}

function buildPythonGolden(className, methodName, expression) {
  return `class ${className}:\n    def ${methodName}(self, n):\n        return ${expression}\n`;
}

function buildJavaScriptTemplate(className, methodName) {
  return `class ${className} {\n  ${methodName}(n) {\n    return null;\n  }\n}\n`;
}

function buildJavaScriptGolden(className, methodName, expression) {
  return `class ${className} {\n  ${methodName}(n) {\n    return ${expression};\n  }\n}\n`;
}

function buildTypeScriptTemplate(className, methodName) {
  return `class ${className} {\n  ${methodName}(n) {\n    return null;\n  }\n}\n`;
}

function buildTypeScriptGolden(className, methodName, expression) {
  return `class ${className} {\n  ${methodName}(n) {\n    return ${expression};\n  }\n}\n`;
}

function computeExpected(op, n, k) {
  if (op === 'add') return n + k;
  if (op === 'subtract') return n - k;
  if (op === 'multiply') return n * k;
  if (op === 'divide') return Math.trunc(n / k);
  if (op === 'square_plus') return n * n + k;
  if (op === 'square_minus') return n * n - k;
  if (op === 'cube_plus') return n * n * n + k;
  return n;
}

function buildTestCases(op, k) {
  const inputs = [0, 5, -3, 12, -10];
  const cases = inputs.map((n, index) => ({
    id: index + 1,
    name: `Case ${index + 1}`,
    input: `n = ${n}`,
    n,
    expected: computeExpected(op, n, k)
  }));

  return {
    runTests: cases.slice(0, 3),
    submitTests: cases
  };
}

function buildAdapterDefinition(className, methodName) {
  return {
    method: methodName,
    className,
    returnType: 'int',
    inputs: [
      {
        name: 'n',
        type: 'int',
        helperBase: 'N',
        javaArrayName: 'ns'
      }
    ]
  };
}

async function seedChallengeAssets(challengeId, className, methodName, op, k) {
  const description = buildDescription({ op, k, methodName });
  upsertChallengeAsset({
    challenge_id: challengeId,
    type: 'description_html',
    language: '',
    content: description
  });

  for (const config of LANGUAGE_CONFIGS) {
    const expression = buildExpression(op, k, config.language);
    const template = config.template(className, methodName, expression);
    const golden = config.golden(className, methodName, expression);

    upsertChallengeAsset({
      challenge_id: challengeId,
      type: 'template',
      language: config.language,
      content: template
    });

    upsertChallengeAsset({
      challenge_id: challengeId,
      type: 'golden',
      language: config.language,
      content: golden
    });
  }
}

async function run() {
  process.env.NODE_ENV = 'test';
  initDatabase();

  const insertedIds = [];

  for (const challenge of DB_ONLY_CHALLENGES) {
    const className = toPascalCase(challenge.id);
    const methodName = toCamelCase(challenge.id);

    const result = insertChallengeIfMissing({
      id: challenge.id,
      name: challenge.name,
      folder: challenge.id,
      test_file: 'db-only',
      adapter: 'db-only',
      difficulty: 'easy',
      topics: ['Math']
    });

    if (!result?.changes) {
      continue;
    }

    insertedIds.push(challenge.id);

    const definition = buildAdapterDefinition(className, methodName);
    upsertChallengeAdapterDefinition(challenge.id, definition);

    await seedChallengeAssets(challenge.id, className, methodName, challenge.op, challenge.k);

    const { runTests, submitTests } = buildTestCases(challenge.op, challenge.k);
    replaceChallengeTestCases(challenge.id, 'run', runTests);
    replaceChallengeTestCases(challenge.id, 'submit', submitTests);
  }

  console.log(JSON.stringify({
    inserted: insertedIds.length,
    insertedIds
  }, null, 2));
}

export const __testables = {
  DB_ONLY_CHALLENGES,
  toPascalCase,
  toCamelCase,
  buildExpression,
  buildDescription,
  buildTestCases,
  buildAdapterDefinition,
  computeExpected
};

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  run().catch((error) => {
    console.error('DB-only challenge seed failed:', error);
    process.exitCode = 1;
  });
}
