import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "containsTarget",
  "className": "ContainsTarget",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    },
    {
      "name": "target",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
