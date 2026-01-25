import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "squareMinusTwo",
  "className": "SquareMinusTwo",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
