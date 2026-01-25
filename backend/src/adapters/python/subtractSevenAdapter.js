import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "subtractSeven",
  "className": "SubtractSeven",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
