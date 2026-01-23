import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "productOfDigits",
  "className": "ProductOfDigits",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
