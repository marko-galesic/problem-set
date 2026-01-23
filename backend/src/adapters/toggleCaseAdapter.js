import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "toggleCase",
  "className": "ToggleCase",
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
