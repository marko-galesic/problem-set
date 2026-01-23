import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "sumFromOneToN",
  "className": "SumFromOneToN",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
