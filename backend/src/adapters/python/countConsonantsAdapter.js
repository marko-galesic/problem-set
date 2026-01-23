import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countConsonants",
  "className": "CountConsonants",
  "returnType": "int",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
