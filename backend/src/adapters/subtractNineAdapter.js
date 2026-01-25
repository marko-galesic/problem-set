import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "subtractNine",
  "className": "SubtractNine",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
