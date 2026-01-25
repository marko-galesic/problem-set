import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "multiplyByTwelve",
  "className": "MultiplyByTwelve",
  "returnType": "int",
  "inputs": [
    {
      "name": "n",
      "type": "int"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
