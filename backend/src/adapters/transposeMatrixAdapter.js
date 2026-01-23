import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "transposeMatrix",
  "className": "TransposeMatrix",
  "returnType": "intMatrix",
  "inputs": [
    {
      "name": "matrix",
      "type": "intGrid"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
