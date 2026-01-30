import { createStandardAdapter } from '../standardAdapterFactory.js';
import { standardAdapterDefinitions } from '../standardAdapterDefinitions.js';

export default createStandardAdapter(standardAdapterDefinitions.rangeSumQueryImmutable, 'python');
