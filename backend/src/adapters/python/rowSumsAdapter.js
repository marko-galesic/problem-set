import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "rowSums",
  "className": "RowSums",
  "returnType": "intArray",
  "inputs": [
    {
      "name": "matrix",
      "type": "intGrid"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
