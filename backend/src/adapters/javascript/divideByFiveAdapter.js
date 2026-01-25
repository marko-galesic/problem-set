import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "divideByFive",
  "className": "DivideByFive",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
