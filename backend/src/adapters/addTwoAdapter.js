import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "addTwo",
  "className": "AddTwo",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
