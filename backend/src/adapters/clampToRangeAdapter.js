import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "clampToRange",
  "className": "ClampToRange",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    },
    {
      "name": "low",
      "type": "int"
    },
    {
      "name": "high",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
