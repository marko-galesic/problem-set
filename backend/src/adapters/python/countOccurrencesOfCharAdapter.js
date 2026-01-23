import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countOccurrencesOfChar",
  "className": "CountOccurrencesOfChar",
  "returnType": "int",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    },
    {
      "name": "c",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
