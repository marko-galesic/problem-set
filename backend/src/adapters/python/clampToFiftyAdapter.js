import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "clampToFifty",
  "className": "ClampToFifty",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
