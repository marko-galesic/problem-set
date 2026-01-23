import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "averageOfArray",
  "className": "AverageOfArray",
  "returnType": "double",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
