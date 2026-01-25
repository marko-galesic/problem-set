import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "divideByThree",
  "className": "DivideByThree",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
