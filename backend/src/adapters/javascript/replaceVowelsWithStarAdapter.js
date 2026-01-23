import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "replaceVowelsWithStar",
  "className": "ReplaceVowelsWithStar",
  "returnType": "string",
  "inputs": [
    {
      "name": "s",
      "type": "string",
      "stringEscape": "basic"
    }
  ]
};

export default createStandardAdapter(definition, 'javascript');
