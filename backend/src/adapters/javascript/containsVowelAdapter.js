import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "containsVowel",
  "className": "ContainsVowel",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
