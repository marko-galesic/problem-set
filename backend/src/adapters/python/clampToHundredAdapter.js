import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "clampToHundred",
  "className": "ClampToHundred",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
