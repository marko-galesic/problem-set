import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "reverseDigits",
  "className": "ReverseDigits",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
