import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "factorialNumber",
  "className": "FactorialNumber",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
