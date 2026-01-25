import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "isMultipleOfSeven",
  "className": "IsMultipleOfSeven",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
