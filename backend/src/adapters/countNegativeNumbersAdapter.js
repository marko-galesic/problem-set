import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "countNegativeNumbers",
  "className": "CountNegativeNumbers",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
