import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "divideBySix",
  "className": "DivideBySix",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
