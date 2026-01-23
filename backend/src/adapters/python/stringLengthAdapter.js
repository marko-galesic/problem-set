import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "stringLength",
  "className": "StringLength",
  "returnType": "int",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
