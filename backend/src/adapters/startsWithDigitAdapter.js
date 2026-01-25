import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "startsWithDigit",
  "className": "StartsWithDigit",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
