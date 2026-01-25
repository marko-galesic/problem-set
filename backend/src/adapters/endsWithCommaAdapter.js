import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "endsWithComma",
  "className": "EndsWithComma",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
