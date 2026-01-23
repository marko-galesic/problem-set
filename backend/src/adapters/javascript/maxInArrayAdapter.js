import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "maxInArray",
  "className": "MaxInArray",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
