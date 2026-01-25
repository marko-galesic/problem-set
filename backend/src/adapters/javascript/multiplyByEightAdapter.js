import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "multiplyByEight",
  "className": "MultiplyByEight",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
