import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "multiplyByEleven",
  "className": "MultiplyByEleven",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
