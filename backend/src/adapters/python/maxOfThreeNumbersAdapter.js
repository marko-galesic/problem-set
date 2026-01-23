import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "maxOfThreeNumbers",
  "className": "MaxOfThreeNumbers",
  "returnType": "int",
  "inputs": [
    {
      "name": "a",
      "type": "int"
    },
    {
      "name": "b",
      "type": "int"
    },
    {
      "name": "c",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
