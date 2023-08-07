import type { AWS } from '@serverless/typescript';

export const cogntioResource: AWS["resources"]["Resources"] = {
    UserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
            UserPoolName: "${self:service}-image-pool",
            Schema: [
                {
                    Name: 'email',
                    Required: true,
                    Mutable: true,
                }
            ],
            Policies: {
                PasswordPolicy: {
                    MinimumLength: 6,
                }
            },
            AutoVerifiedAttributes: ['email'],
        }
    },
    UserClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
            ClientName: '${self:service}-client-${sls:stage}',
            GenerateSecret: false,
            UserPoolId: {
                Ref: 'UserPool',
            },
            AccessTokenValidity: 5,
            IdTokenValidity: 5,
            ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
        }
    }
}
