import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "removeConsonants",
  "className": "RemoveConsonants",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
