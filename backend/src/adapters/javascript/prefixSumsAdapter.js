import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "prefixSums",
  "className": "PrefixSums",
  "returnType": "intArray",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
