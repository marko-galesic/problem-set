import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "squarePlusThree",
  "className": "SquarePlusThree",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
