import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isZero",
  "className": "IsZero",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
