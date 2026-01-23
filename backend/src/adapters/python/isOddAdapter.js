import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isOdd",
  "className": "IsOdd",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
