import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "signOfNumber",
  "className": "SignOfNumber",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
