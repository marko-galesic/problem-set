import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "isPositive",
  "className": "IsPositive",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
