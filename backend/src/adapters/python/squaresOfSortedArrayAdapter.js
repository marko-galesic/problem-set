import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "sortedSquares",
  "className": "SquaresOfSortedArray",
  "returnType": "intArray",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
