import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "repeatNTimes",
  "className": "RepeatNTimes",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    },
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
