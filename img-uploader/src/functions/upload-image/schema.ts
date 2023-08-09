export default {
  type: "object",
  properties: {
    body: { 
      type: 'object',
      properties: {
        key: { type: 'string' },
        url: { type: 'string' },
      }
    }
  },
  required: ['key', 'url'],
} as const;
