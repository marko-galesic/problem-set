import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "rotateLeftByOne",
  "className": "RotateLeftByOne",
  "returnType": "intArray",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
