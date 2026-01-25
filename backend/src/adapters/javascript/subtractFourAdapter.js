import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "subtractFour",
  "className": "SubtractFour",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
