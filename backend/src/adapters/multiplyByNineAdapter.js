import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "multiplyByNine",
  "className": "MultiplyByNine",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
