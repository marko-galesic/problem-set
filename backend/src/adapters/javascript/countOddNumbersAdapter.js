import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countOddNumbers",
  "className": "CountOddNumbers",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
