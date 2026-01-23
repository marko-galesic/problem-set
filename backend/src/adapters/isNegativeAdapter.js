import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "isNegative",
  "className": "IsNegative",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
