import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "countLowercase",
  "className": "CountLowercase",
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
