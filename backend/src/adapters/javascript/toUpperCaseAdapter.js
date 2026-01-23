import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "toUpperCase",
  "className": "ToUpperCase",
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
