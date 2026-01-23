import { createStandardAdapter } from './standardAdapterFactory.js';

const definition = {
  "method": "replaceSpacesWithHyphen",
  "className": "ReplaceSpacesWithHyphen",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'java');
