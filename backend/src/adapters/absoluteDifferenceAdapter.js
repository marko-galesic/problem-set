import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "absoluteDifference",
  "className": "AbsoluteDifference",
  "returnType": "int",
  "inputs": [
    {
      "name": "a",
      "type": "int"
    },
    {
      "name": "b",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
