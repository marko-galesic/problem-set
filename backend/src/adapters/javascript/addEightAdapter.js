import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addEight",
  "className": "AddEight",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
