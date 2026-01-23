import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countBits",
  "className": "CountBits",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
