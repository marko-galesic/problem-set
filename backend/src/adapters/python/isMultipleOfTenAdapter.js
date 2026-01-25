import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isMultipleOfTen",
  "className": "IsMultipleOfTen",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
