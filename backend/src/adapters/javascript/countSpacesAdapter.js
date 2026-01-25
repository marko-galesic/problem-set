import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countSpaces",
  "className": "CountSpaces",
  "returnType": "int",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
