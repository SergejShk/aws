import type { AWS } from '@serverless/typescript';

import { uploadImage } from '@functions/index';

import { s3Resource } from 'src/resources/s3Resource';

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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: "${self:service}-image-bucket",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:*"
            ],
            Resource: [
              ['arn:aws:s3:::${self:service}-image-bucket']
            ],
          },
        ]
      }
    }
  },
  // import the function via paths
  functions: { uploadImage },
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
      ...s3Resource
    },
},
};

module.exports = serverlessConfiguration;
