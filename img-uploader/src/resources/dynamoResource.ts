import type { AWS } from '@serverless/typescript';

export const dynamoResource: AWS["resources"]["Resources"] = {
    ImagesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: '${self:service}-images',
            AttributeDefinitions: [
                {
                    AttributeName: 'primary_key',
                    AttributeType: 'S',
                }
            ],
            KeySchema: [
                {
                    AttributeName: 'primary_key',
                    KeyType: 'HASH',
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: '1',
                WriteCapacityUnits: '1',
            },
        }
    }
}