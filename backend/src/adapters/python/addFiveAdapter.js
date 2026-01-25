import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addFive",
  "className": "AddFive",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
