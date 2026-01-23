import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "addThree",
  "className": "AddThree",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
