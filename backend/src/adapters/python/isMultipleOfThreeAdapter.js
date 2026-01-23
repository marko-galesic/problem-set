import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isMultipleOfThree",
  "className": "IsMultipleOfThree",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
