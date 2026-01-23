import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "trimWhitespace",
  "className": "TrimWhitespace",
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
