import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "collapseSpaces",
  "className": "CollapseSpaces",
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
