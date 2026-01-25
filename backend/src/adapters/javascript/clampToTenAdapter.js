import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "clampToTen",
  "className": "ClampToTen",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
