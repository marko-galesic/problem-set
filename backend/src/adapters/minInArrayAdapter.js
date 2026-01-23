import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "minInArray",
  "className": "MinInArray",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
