import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "reverseArray",
  "className": "ReverseArray",
  "returnType": "intArray",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
