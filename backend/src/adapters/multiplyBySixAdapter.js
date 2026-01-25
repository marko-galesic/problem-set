import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "multiplyBySix",
  "className": "MultiplyBySix",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
