import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "countDigitsInString",
  "className": "CountDigitsInString",
  "returnType": "int",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
