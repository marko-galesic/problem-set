import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "subtractThree",
  "className": "SubtractThree",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
