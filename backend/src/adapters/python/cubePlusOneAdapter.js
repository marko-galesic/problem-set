import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "cubePlusOne",
  "className": "CubePlusOne",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
