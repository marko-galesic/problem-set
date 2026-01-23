import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "negateNumber",
  "className": "NegateNumber",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
