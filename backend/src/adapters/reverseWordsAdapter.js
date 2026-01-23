import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "reverseWords",
  "className": "ReverseWords",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
