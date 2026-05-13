import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'your_project_id',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-05-13', // use current date (YYYY-MM-DD) to target the latest API version
});
