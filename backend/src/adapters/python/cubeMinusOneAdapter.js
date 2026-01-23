import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "cubeMinusOne",
  "className": "CubeMinusOne",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
