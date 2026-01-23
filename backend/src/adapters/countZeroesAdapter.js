import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "countZeroes",
  "className": "CountZeroes",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
