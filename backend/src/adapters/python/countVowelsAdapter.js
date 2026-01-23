import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countVowels",
  "className": "CountVowels",
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
