import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "endsWithPeriod",
  "className": "EndsWithPeriod",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
