import * as AWS from "aws-sdk";
import * as parser from "lambda-multipart-parser";
import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const s3 = new AWS.S3()

const saveFile = async (file: parser.MultipartFile) => {
  const BucketName = process.env.BUCKET_NAME

  await s3.putObject({
    Bucket: BucketName,
    Key: file.filename,
    Body: file.content,
  }).promise();

  return { savedFile: `https://${BucketName}.s3.amazonaws.com/${file.filename}` }
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
