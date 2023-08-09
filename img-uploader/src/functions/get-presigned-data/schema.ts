export default {
    type: "object",
    properties: {
      body: { 
        type: 'object',
        properties: {
          fileName: { type: 'string' },
        }
      }
    },
    required: ['fileName'],
  } as const;