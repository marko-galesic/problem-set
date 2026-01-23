import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addOne",
  "className": "AddOne",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
