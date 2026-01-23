import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "repeatTwice",
  "className": "RepeatTwice",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
