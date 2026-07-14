import { defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short summary of the post for the blog grid.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'SaaS', value: 'SaaS' },
          { title: 'Healthcare Tech', value: 'Healthcare Tech' },
          { title: 'Technical SEO', value: 'Technical SEO' },
          { title: 'Engineering', value: 'Engineering' },
          { title: 'Design', value: 'Design' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Published Date',
      type: 'date',
    }),
    defineField({
      name: 'seriesName',
      title: 'Series Name',
      type: 'string',
      description: 'Optional. If this post is part of a series, what is the name of the series? (e.g., "The AI Migration Guide")',
    }),
    defineField({
      name: 'seriesEpisode',
      title: 'Series Episode Number',
      type: 'number',
      description: 'Optional. The part number in the series (e.g., 1, 2, 3)',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (Minutes)',
      type: 'number',
      description: 'Optional override. We will calculate this automatically, but you can override it here.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        {
          type: 'code',
          title: 'Code Snippet',
          options: {
            language: 'typescript',
            withFilename: true,
          },
        },
        {
          name: 'animatedImage',
          type: 'object',
          title: 'Animated Image (Lottie/Video)',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL to Animation',
              description: 'Link to a hosted .json Lottie file or .mp4/.webm video file.',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for accessibility and SEO.',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title used for search engines and browser tabs.',
          validation: Rule => Rule.max(60).warning('Longer titles may be truncated by search engines')
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Description for search engines.',
          validation: Rule => Rule.max(160).warning('Longer descriptions may be truncated by search engines')
        },
        {
          name: 'ogImage',
          title: 'Social Sharing Image (Open Graph)',
          type: 'image',
          description: 'Image displayed when sharing the post on social media (1200x630px recommended).',
        }
      ]
    }),
  ],
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
