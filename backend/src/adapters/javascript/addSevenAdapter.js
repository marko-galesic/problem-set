import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addSeven",
  "className": "AddSeven",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
