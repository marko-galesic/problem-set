import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "squarePlusOne",
  "className": "SquarePlusOne",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
