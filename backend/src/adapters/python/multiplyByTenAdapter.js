import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "multiplyByTen",
  "className": "MultiplyByTen",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
