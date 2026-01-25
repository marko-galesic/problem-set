import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isMultipleOfNine",
  "className": "IsMultipleOfNine",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
