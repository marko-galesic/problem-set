import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "removeSpaces",
  "className": "RemoveSpaces",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
