import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "subtractTen",
  "className": "SubtractTen",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
