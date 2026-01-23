import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "startsWithCapital",
  "className": "StartsWithCapital",
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
