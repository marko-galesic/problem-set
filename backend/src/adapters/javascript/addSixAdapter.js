import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "addSix",
  "className": "AddSix",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
