import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isAllDigits",
  "className": "IsAllDigits",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
