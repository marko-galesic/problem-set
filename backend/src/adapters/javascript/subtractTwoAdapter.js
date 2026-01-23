import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "subtractTwo",
  "className": "SubtractTwo",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
