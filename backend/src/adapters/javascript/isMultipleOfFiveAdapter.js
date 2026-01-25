import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isMultipleOfFive",
  "className": "IsMultipleOfFive",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
