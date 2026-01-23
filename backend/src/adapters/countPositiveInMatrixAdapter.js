import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "countPositiveInMatrix",
  "className": "CountPositiveInMatrix",
  "returnType": "int",
  "inputs": [
    {
      "name": "matrix",
      "type": "intGrid"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
