import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "containsDigit",
  "className": "ContainsDigit",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
