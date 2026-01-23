import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "multiplyByThree",
  "className": "MultiplyByThree",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
