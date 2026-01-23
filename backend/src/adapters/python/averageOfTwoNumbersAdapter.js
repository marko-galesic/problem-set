import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "averageOfTwoNumbers",
  "className": "AverageOfTwoNumbers",
  "returnType": "double",
  "inputs": [
    {
      "name": "a",
      "type": "int"
    },
    {
      "name": "b",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
