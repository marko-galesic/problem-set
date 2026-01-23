import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countEvenNumbers",
  "className": "CountEvenNumbers",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
