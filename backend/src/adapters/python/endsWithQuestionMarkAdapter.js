import { createStandardAdapter } from '../standardAdapterFactory.js';

const definition = {
  "method": "endsWithQuestionMark",
  "className": "EndsWithQuestionMark",
  "returnType": "boolean",
  "inputs": [
    {
      "name": "s",
      "type": "string"
    }
  ]
};

export default createStandardAdapter(definition, 'python');
