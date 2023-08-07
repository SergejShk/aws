import type { AWS } from '@serverless/typescript';

import { register, uploadImage } from '@functions/index';
import { getImages } from '@functions/index';

import { cogntioResource } from 'src/resources/cognitoResource';
import { s3Resource } from 'src/resources/s3Resource';
import { dynamoResource } from 'src/resources/dynamoResource';

const serverlessConfiguration: AWS = {
  service: 'img-uploader',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      binaryMediaTypes: ["*/*"]
    },
    environment: {
      USER_POOL: { Ref: 'UserPool' },
      USER_POOL_CLIENT: { Ref: 'UserClient' },
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: "${self:service}-image-bucket",
      IMAGES_TABLE: "${self:service}-images",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "cognito-idp:AdminInitiateAuth",
              "cognito-idp:AdminCreateUser",
              "cognito-idp:AdminSetUserPassword",
            ],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: [
              ['arn:aws:s3:::${self:service}-image-bucket']
            ],
          },
          {
            Effect: "Allow",
            Action: [
              "dynamodb:PutItem",
              "dynamodb:Get*",
              "dynamodb:Scan",
              "dynamodb:Query",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: [
              ['arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:service}-images']
            ],
          },
        ]
      }
    }
  },
  // import the function via paths
  functions: { register, uploadImage, getImages },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ...cogntioResource,
      ...s3Resource,
      ...dynamoResource,
    },
},
};

module.exports = serverlessConfiguration;
