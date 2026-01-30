import { createStandardAdapter } from '../standardAdapterFactory.js';
import { standardAdapterDefinitions } from '../standardAdapterDefinitions.js';

export default createStandardAdapter(standardAdapterDefinitions.validParenthesesWithStar, 'python');
