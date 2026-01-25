import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "containsLowercase",
  "className": "ContainsLowercase",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
