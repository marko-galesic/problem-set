import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "multiplyByFour",
  "className": "MultiplyByFour",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
