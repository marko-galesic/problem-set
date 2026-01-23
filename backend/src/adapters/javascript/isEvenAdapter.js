import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "isEven",
  "className": "IsEven",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
