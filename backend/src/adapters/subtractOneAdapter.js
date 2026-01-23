import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "subtractOne",
  "className": "SubtractOne",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
