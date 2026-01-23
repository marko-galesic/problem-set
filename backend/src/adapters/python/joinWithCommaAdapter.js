import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "joinWithComma",
  "className": "JoinWithComma",
  "returnType": "string",
  "inputs": [
    {
      "name": "words",
      "type": "stringArray"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
