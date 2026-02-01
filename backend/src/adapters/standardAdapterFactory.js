import * as javaHelpers from './helpers/java.js';
import * as jsHelpers from './helpers/javascript.js';
import * as pyHelpers from './helpers/python.js';

function createAdapter(config) {
  const defaults = {
    checkUserDefinedClasses: () => ({}),
    generateHelperClasses: () => '',
    preprocessTestCases: (testCases) => testCases,
    transformUserCode: (userCode) => userCode
  };

  return {
    extractInput: config.extractInput || ((testCase) => testCase),
    buildExpectedCode: config.buildExpectedCode || (() => ''),
    generateSerializer: config.generateSerializer || (() => ''),
    generateInvocation: config.generateInvocation || (() => ''),
    generateInputHelpers: config.generateInputHelpers || (() => ''),
    checkUserDefinedClasses: config.checkUserDefinedClasses || defaults.checkUserDefinedClasses,
    generateHelperClasses: config.generateHelperClasses || defaults.generateHelperClasses,
    getReturnType: config.getReturnType || (() => ''),
    getSerializerMethod: config.getSerializerMethod || (() => ''),
    getDefaultClassName: config.getDefaultClassName || (() => config.defaultClassName || 'Solution'),
    preprocessTestCases: config.preprocessTestCases || defaults.preprocessTestCases,
    transformUserCode: config.transformUserCode || defaults.transformUserCode
  };
}

const DEFAULT_INPUT_VALUES = {
  int: 0,
  double: 0,
  boolean: false,
  string: '',
  intArray: [],
  stringArray: [],
  intGrid: [],
  charGrid: []
};

const JAVA_TYPE_MAP = {
  int: 'int',
  double: 'double',
  boolean: 'boolean',
  string: 'String',
  intArray: 'int[]',
  stringArray: 'String[]',
  intGrid: 'int[][]',
  charGrid: 'char[][]'
};

const JAVASCRIPT_RETURN_TYPES = {
  int: 'number',
  double: 'number',
  boolean: 'boolean',
  string: 'string',
  intArray: 'number[]',
  stringArray: 'string[]',
  intMatrix: 'number[][]',
  stringMatrix: 'string[][]',
  charMatrix: 'string[][]'
};

const JAVA_RETURN_TYPES = {
  int: 'int',
  double: 'double',
  boolean: 'boolean',
  string: 'String',
  intArray: 'int[]',
  stringArray: 'String[]',
  intMatrix: 'int[][]',
  stringMatrix: 'String[][]',
  charMatrix: 'char[][]'
};

const PYTHON_RETURN_TYPES = {
  int: 'int',
  double: 'float',
  boolean: 'bool',
  string: 'str',
  intArray: 'list[int]',
  stringArray: 'list[str]',
  intMatrix: 'list[list[int]]',
  stringMatrix: 'list[list[str]]',
  charMatrix: 'list[list[str]]'
};

const SERIALIZER_METHODS = {
  java: {
    int: 'serializeInt',
    double: 'serializeDouble',
    boolean: 'serializeBoolean',
    string: 'serializeString',
    intArray: 'serializeIntArray',
    stringArray: 'serializeStringArray',
    stringArrayCoerceEmpty: 'serializeStringArray',
    intMatrix: 'serializeIntMatrix',
    stringMatrix: 'serializeStringMatrix',
    charMatrix: 'serializeCharMatrix'
  },
  javascript: {
    int: 'serializeInt',
    double: 'serializeDouble',
    boolean: 'serializeBoolean',
    string: 'serializeString',
    intArray: 'serializeIntArray',
    stringArray: 'serializeStringArray',
    stringArrayCoerceEmpty: 'serializeStringArray',
    intMatrix: 'serializeIntMatrix',
    stringMatrix: 'serializeStringMatrix',
    charMatrix: 'serializeCharMatrix'
  },
  python: {
    int: 'serialize_int',
    double: 'serialize_double',
    boolean: 'serialize_boolean',
    string: 'serialize_string',
    intArray: 'serialize_int_array',
    stringArray: 'serialize_string_array',
    stringArrayCoerceEmpty: 'serialize_string_array',
    intMatrix: 'serialize_int_matrix',
    stringMatrix: 'serialize_string_matrix',
    charMatrix: 'serialize_char_matrix'
  }
};

const JAVASCRIPT_CONFIG = {
  expectedBuilders: {
    int: jsHelpers.buildExpectedIntCode,
    double: jsHelpers.buildExpectedDoubleCode,
    boolean: jsHelpers.buildExpectedBooleanCode,
    string: jsHelpers.buildExpectedStringCode,
    intArray: jsHelpers.buildExpectedListCode,
    stringArray: jsHelpers.buildExpectedListCode,
    stringArrayCoerceEmpty: jsHelpers.buildExpectedStringArrayCoerceEmptyCode,
    intMatrix: jsHelpers.buildExpectedListCode,
    stringMatrix: jsHelpers.buildExpectedListCode,
    charMatrix: jsHelpers.buildExpectedListCode
  },
  serializers: {
    int: jsHelpers.serializeInt,
    double: jsHelpers.serializeDouble,
    boolean: jsHelpers.serializeBoolean,
    string: jsHelpers.serializeString,
    intArray: jsHelpers.serializeIntArray,
    stringArray: jsHelpers.serializeStringArray,
    stringArrayCoerceEmpty: jsHelpers.serializeStringArrayCoerceEmpty,
    intMatrix: jsHelpers.serializeIntMatrix,
    stringMatrix: jsHelpers.serializeStringMatrix,
    charMatrix: jsHelpers.serializeCharMatrix
  },
  inputBuilders: {
    int: jsHelpers.buildIntScalarInputHelper,
    intArray: jsHelpers.buildIntArrayInputHelper,
    string: jsHelpers.buildStringInputHelper,
    stringArray: jsHelpers.buildStringArrayInputHelper,
    intGrid: jsHelpers.buildGridInputHelper,
    charGrid: jsHelpers.buildCharGridInputHelper
  },
  returnTypes: JAVASCRIPT_RETURN_TYPES,
  serializerMethods: SERIALIZER_METHODS.javascript,
  invocationIndent: '          ',
  inputJoiner: '\n\n',
  helperName: (base) => `getTest${base}`
};

const LANGUAGE_CONFIG = {
  java: {
    expectedBuilders: {
      int: javaHelpers.buildExpectedIntCode,
      double: javaHelpers.buildExpectedDoubleCode,
      boolean: javaHelpers.buildExpectedBooleanCode,
      string: javaHelpers.buildExpectedStringCode,
      intArray: javaHelpers.buildExpectedIntArrayCode,
      stringArray: javaHelpers.buildExpectedStringArrayCode,
      stringArrayCoerceEmpty: javaHelpers.buildExpectedStringArrayCoerceEmptyCode,
      intMatrix: javaHelpers.buildExpectedIntMatrixCode,
      stringMatrix: javaHelpers.buildExpectedStringMatrixCode,
      charMatrix: javaHelpers.buildExpectedCharMatrixCode
    },
    serializers: {
      int: javaHelpers.serializeInt,
      double: javaHelpers.serializeDouble,
      boolean: javaHelpers.serializeBoolean,
      string: javaHelpers.serializeString,
      intArray: javaHelpers.serializeIntArray,
      stringArray: javaHelpers.serializeStringArray,
      stringArrayCoerceEmpty: javaHelpers.serializeStringArrayCoerceEmpty,
      intMatrix: javaHelpers.serializeIntMatrix,
      stringMatrix: javaHelpers.serializeStringMatrix,
      charMatrix: javaHelpers.serializeCharMatrix
    },
    inputBuilders: {
      int: javaHelpers.buildIntScalarInputHelper,
      intArray: javaHelpers.buildIntArrayInputHelper,
      string: javaHelpers.buildStringInputHelper,
      stringArray: javaHelpers.buildStringArrayInputHelper,
      intGrid: javaHelpers.buildIntGridInputHelper,
      charGrid: javaHelpers.buildCharGridInputHelper
    },
    returnTypes: JAVA_RETURN_TYPES,
    serializerMethods: SERIALIZER_METHODS.java,
    invocationIndent: '                    ',
    inputJoiner: '\n\n',
    helperName: (base) => `getTest${base}`,
    inputTypeNames: JAVA_TYPE_MAP
  },
  javascript: JAVASCRIPT_CONFIG,
  typescript: JAVASCRIPT_CONFIG,
  python: {
    expectedBuilders: {
      int: pyHelpers.buildExpectedIntCode,
      double: pyHelpers.buildExpectedDoubleCode,
      boolean: pyHelpers.buildExpectedBooleanCode,
      string: pyHelpers.buildExpectedStringCode,
      intArray: pyHelpers.buildExpectedListCode,
      stringArray: pyHelpers.buildExpectedListCode,
      stringArrayCoerceEmpty: pyHelpers.buildExpectedStringArrayCoerceEmptyCode,
      intMatrix: pyHelpers.buildExpectedListCode,
      stringMatrix: pyHelpers.buildExpectedListCode,
      charMatrix: pyHelpers.buildExpectedListCode
    },
    serializers: {
      int: pyHelpers.serializeInt,
      double: pyHelpers.serializeDouble,
      boolean: pyHelpers.serializeBoolean,
      string: pyHelpers.serializeString,
      intArray: pyHelpers.serializeIntArray,
      stringArray: pyHelpers.serializeStringArray,
      stringArrayCoerceEmpty: pyHelpers.serializeStringArrayCoerceEmpty,
      intMatrix: pyHelpers.serializeIntMatrix,
      stringMatrix: pyHelpers.serializeStringMatrix,
      charMatrix: pyHelpers.serializeCharMatrix
    },
    inputBuilders: {
      int: pyHelpers.buildIntScalarInputHelper,
      intArray: pyHelpers.buildListInputHelper,
      string: pyHelpers.buildStringInputHelper,
      stringArray: pyHelpers.buildListInputHelper,
      intGrid: pyHelpers.buildGridInputHelper,
      charGrid: pyHelpers.buildGridInputHelper
    },
    returnTypes: PYTHON_RETURN_TYPES,
    serializerMethods: SERIALIZER_METHODS.python,
    invocationIndent: '',
    inputJoiner: '\n',
    helperName: (base) => `get_test_${toSnakeCase(base)}`
  }
};

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toSnakeCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1_$2')
    .toLowerCase();
}

function resolveHelperBase(input) {
  return input.helperBase || toPascalCase(input.name);
}

function buildInvocation(definition, language, parserVar) {
  const config = LANGUAGE_CONFIG[language];
  const args = definition.inputs.map((input) => input.name).join(', ');

  if (language === 'java') {
    const lines = definition.inputs.map((input) => {
      const typeName = config.inputTypeNames[input.type];
      const helperName = config.helperName(resolveHelperBase(input));
      return `${config.invocationIndent}${typeName} ${input.name} = ${helperName}(i);`;
    });
    lines.push(`${config.invocationIndent}actual = ${parserVar}.${definition.method}(${args});`);
    return lines.join('\n');
  }

  if (language === 'javascript' || language === 'typescript') {
    const lines = definition.inputs.map((input) => {
      const helperName = config.helperName(resolveHelperBase(input));
      return `const ${input.name} = ${helperName}(i);`;
    });
    lines.push(`actual = ${parserVar}.${definition.method}(${args});`);
    return lines
      .map((line, index) => (index === 0 ? line : `${config.invocationIndent}${line}`))
      .join('\n');
  }

  const lines = definition.inputs.map((input) => {
    const helperName = config.helperName(resolveHelperBase(input));
    return `${input.name} = ${helperName}(i)`;
  });
  lines.push(`actual = ${parserVar}.${definition.method}(${args})`);
  return lines.join('\n');
}

function buildInputHelpers(definition, language, testCases) {
  const config = LANGUAGE_CONFIG[language];
  const helperSnippets = definition.inputs.map((input) => {
    const builder = config.inputBuilders[input.type];
    if (!builder) {
      throw new Error(`No input helper for type ${input.type} (${definition.method})`);
    }
    const helperName = config.helperName(resolveHelperBase(input));
    if (language === 'java' && input.type === 'int' && input.javaArrayName) {
      return builder(testCases, input.name, helperName, input.javaArrayName);
    }
    if (language === 'java' && input.type === 'string' && input.stringEscape) {
      return builder(testCases, input.name, helperName, input.stringEscape);
    }
    return builder(testCases, input.name, helperName);
  });

  if (helperSnippets.length === 0) {
    return '';
  }

  if (helperSnippets.length === 1) {
    return helperSnippets[0];
  }

  const joiner = language === 'python' && definition.pythonInputJoiner
    ? definition.pythonInputJoiner
    : config.inputJoiner;
  return helperSnippets.join(joiner);
}

export function createStandardAdapter(definition, language = 'java') {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    throw new Error(`Unsupported adapter language: ${language}`);
  }

  const expectedKey = definition.expectedVariant || definition.returnType;
  const serializerKey = definition.serializerVariant || definition.returnType;
  const buildExpected = config.expectedBuilders[expectedKey];
  const serializer = config.serializers[serializerKey];

  if (!buildExpected) {
    throw new Error(`Missing expected builder for ${expectedKey} (${definition.method})`);
  }
  if (!serializer) {
    throw new Error(`Missing serializer for ${serializerKey} (${definition.method})`);
  }

  return createAdapter({
    extractInput: (testCase) => {
      const extracted = {};
      for (const input of definition.inputs) {
        const fallback = DEFAULT_INPUT_VALUES[input.type];
        extracted[input.name] = testCase[input.name] !== undefined
          ? testCase[input.name]
          : fallback;
      }
      return extracted;
    },
    buildExpectedCode: (expected, indent, varName) => buildExpected(expected, indent, varName),
    generateSerializer: () => serializer(),
    generateInvocation: (parserVar) => buildInvocation(definition, language, parserVar),
    generateInputHelpers: (testCases) => buildInputHelpers(definition, language, testCases),
    getReturnType: () => config.returnTypes[definition.returnType],
    getSerializerMethod: () => config.serializerMethods[serializerKey],
    getDefaultClassName: () => definition.className
  });
}
