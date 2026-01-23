import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "indexOfTarget",
  "className": "IndexOfTarget",
  "returnType": "int",
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

export default createStandardAdapter(definition, 'javascript');
