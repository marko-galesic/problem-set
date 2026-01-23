import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "firstCharacter",
  "className": "FirstCharacter",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
