import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "removeDigits",
  "className": "RemoveDigits",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
