import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "endsWithExclamation",
  "className": "EndsWithExclamation",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
