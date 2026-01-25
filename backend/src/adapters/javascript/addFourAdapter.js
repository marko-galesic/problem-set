import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addFour",
  "className": "AddFour",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
