import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "subtractEight",
  "className": "SubtractEight",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
