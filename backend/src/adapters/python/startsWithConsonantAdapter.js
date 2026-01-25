import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "startsWithConsonant",
  "className": "StartsWithConsonant",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
