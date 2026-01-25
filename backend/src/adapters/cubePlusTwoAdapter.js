import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "cubePlusTwo",
  "className": "CubePlusTwo",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
