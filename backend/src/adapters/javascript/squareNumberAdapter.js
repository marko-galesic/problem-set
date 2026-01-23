import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "squareNumber",
  "className": "SquareNumber",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
