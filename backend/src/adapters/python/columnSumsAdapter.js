import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "columnSums",
  "className": "ColumnSums",
  "returnType": "intArray",
  "inputs": [
    {
      "name": "matrix",
      "type": "intGrid"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
