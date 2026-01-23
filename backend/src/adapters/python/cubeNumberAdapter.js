import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "cubeNumber",
  "className": "CubeNumber",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
