import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "sumOfArray",
  "className": "SumOfArray",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
