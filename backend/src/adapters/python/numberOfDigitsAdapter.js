import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "numberOfDigits",
  "className": "NumberOfDigits",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
