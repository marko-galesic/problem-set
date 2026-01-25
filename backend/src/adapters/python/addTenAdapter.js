import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addTen",
  "className": "AddTen",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
