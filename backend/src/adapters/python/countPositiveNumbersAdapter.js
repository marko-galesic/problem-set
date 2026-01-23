import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countPositiveNumbers",
  "className": "CountPositiveNumbers",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
