import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "multiplyBySeven",
  "className": "MultiplyBySeven",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
