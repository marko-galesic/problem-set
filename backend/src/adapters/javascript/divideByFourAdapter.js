import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "divideByFour",
  "className": "DivideByFour",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
