import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "lastIndexOfChar",
  "className": "LastIndexOfChar",
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

export default createStandardAdapter(definition, 'java');
