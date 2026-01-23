import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "removeVowels",
  "className": "RemoveVowels",
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
