import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "runningMax",
  "className": "RunningMax",
  "returnType": "intArray",
  "inputs": [
    {
      "name": "nums",
      "type": "intArray"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
