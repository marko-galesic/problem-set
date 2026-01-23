import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "diagonalSum",
  "className": "DiagonalSum",
  "returnType": "int",
  "inputs": [
    {
      "name": "matrix",
      "type": "intGrid"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
