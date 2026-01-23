import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "onlyLetters",
  "className": "OnlyLetters",
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
