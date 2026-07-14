import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './src/sanity/schemaTypes';

export default defineConfig({
  name: 'omnidevx-studio',
  title: 'Omnidevx Blog Studio',

  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || import.meta.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});
