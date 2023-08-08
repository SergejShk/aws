import * as parser from "lambda-multipart-parser";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { sendResponse } from "src/utils/sendResponse";
import { BucketName, TableName } from "src/utils/const";
import { dynamoDB, s3 } from "src/utils/providers";
import { retrieveAuthData } from "src/utils/retrieveAuthData";

const saveFile = async (file: parser.MultipartFile, userName: string) => {
  const newFileName = uuidv4()

  await s3.putObject({
    Bucket: BucketName,
    Key: newFileName,
    Body: file.content,
  }).promise();

  const fileToSave = {
    primary_key: newFileName,
    email: userName,
    name: file.filename,
    url: `https://${BucketName}.s3.amazonaws.com/${newFileName}`
  }

  await dynamoDB.put({
    TableName,
    Item: fileToSave,
}).promise();

  return fileToSave
}

const uploadImage = async (event: APIGatewayProxyEvent) => {
  const authData = retrieveAuthData(event)
  const userName = authData?.username || ''

  try {
    const { files } = await parser.parse(event)

    const savedImages = files.map((file) => saveFile(file, userName))
    const result = await Promise.all(savedImages);

  return formatJSONResponse({
    message: `Images uploaded seccessfully!`,
    body: result,
  });
  } catch (error) {
    return sendResponse(400, error);
  }
};

export const main = middyfy(uploadImage);
