import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "subtractFive",
  "className": "SubtractFive",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
