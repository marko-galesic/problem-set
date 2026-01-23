import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countWords",
  "className": "CountWords",
  "returnType": "int",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
