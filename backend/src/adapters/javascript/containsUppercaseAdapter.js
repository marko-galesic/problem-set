import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "containsUppercase",
  "className": "ContainsUppercase",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
