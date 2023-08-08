import schema from './schema';

import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        authorizer: {
          authorizerId: { Ref: 'ApiAuthorizer' },
          type: 'COGNITO_USER_POOLS',
          claims: ['email'],
        },   
      },
    },
  ],
};
