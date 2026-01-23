import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "longestWordLength",
  "className": "LongestWordLength",
  "returnType": "int",
  "inputs": [
    {
      "name": "words",
      "type": "stringArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
