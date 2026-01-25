import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "replaceSpacesWithPlus",
  "className": "ReplaceSpacesWithPlus",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
