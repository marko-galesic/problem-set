import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "squarePlusTwo",
  "className": "SquarePlusTwo",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
