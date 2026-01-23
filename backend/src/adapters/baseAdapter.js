// Base adapter factory for shared defaults across challenges

export function createAdapter(config) {
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
