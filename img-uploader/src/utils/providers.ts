import * as AWS from "aws-sdk";

export const dynamoDB = new AWS.DynamoDB.DocumentClient()
export const s3 = new AWS.S3()
