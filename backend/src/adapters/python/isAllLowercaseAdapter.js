import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isAllLowercase",
  "className": "IsAllLowercase",
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
