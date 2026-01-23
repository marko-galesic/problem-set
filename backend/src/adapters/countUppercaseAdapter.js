import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "countUppercase",
  "className": "CountUppercase",
  "returnType": "int",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
