import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isPowerOfTwo",
  "className": "IsPowerOfTwo",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
