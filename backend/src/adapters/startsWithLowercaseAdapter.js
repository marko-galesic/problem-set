import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "startsWithLowercase",
  "className": "StartsWithLowercase",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
