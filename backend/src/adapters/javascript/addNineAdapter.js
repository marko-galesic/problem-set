import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addNine",
  "className": "AddNine",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
