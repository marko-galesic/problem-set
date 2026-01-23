import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countGreaterThan",
  "className": "CountGreaterThan",
  "returnType": "int",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    },
    {
      "name": "threshold",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
