export default {
  type: "object",
  properties: {
    body: { 
      type: 'object',
      properties: {
        image: { type: 'string' },
      }
    }
  },
  required: ['image'],
} as const;
