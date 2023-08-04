import * as AWS from "aws-sdk";
import * as parser from "lambda-multipart-parser";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const s3 = new AWS.S3()
const dynamoDB = new AWS.DynamoDB.DocumentClient()

const saveFile = async (file: parser.MultipartFile) => {
  const BucketName = process.env.BUCKET_NAME
  const TableName = process.env.IMAGES_TABLE

  const newFileName = uuidv4()

  await s3.putObject({
    Bucket: BucketName,
    Key: newFileName,
    Body: file.content,
  }).promise();

  const fileToSave = {
    primary_key: uuidv4(),
    link: `https://${BucketName}.s3.amazonaws.com/${newFileName}`
  }

  await dynamoDB.put({
    TableName: TableName,
    Item: fileToSave,
}).promise();

  return fileToSave
}

const uploadImage = async (event: APIGatewayProxyEvent) => {
  const { files } = await parser.parse(event)
  
  const savedImages = files.map(saveFile)
  const result = await Promise.all(savedImages);

  return formatJSONResponse({
    message: `Images uploaded seccessfully!`,
    body: result,
  });
};

export const main = middyfy(uploadImage);
