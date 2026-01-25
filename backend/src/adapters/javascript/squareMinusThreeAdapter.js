import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "squareMinusThree",
  "className": "SquareMinusThree",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
