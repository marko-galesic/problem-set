import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "lastCharacter",
  "className": "LastCharacter",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
