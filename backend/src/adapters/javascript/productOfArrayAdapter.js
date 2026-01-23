import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "productOfArray",
  "className": "ProductOfArray",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
