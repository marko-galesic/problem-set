import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "sumOfSquares",
  "className": "SumOfSquares",
  "returnType": "int",
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
