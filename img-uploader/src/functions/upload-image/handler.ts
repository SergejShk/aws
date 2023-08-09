import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from "./schema";

import { sendResponse } from "src/utils/sendResponse";
import { TableName } from "src/utils/const";
import { dynamoDB } from "src/utils/providers";
import { retrieveAuthData } from "src/utils/retrieveAuthData";

const saveFile = async (key: string, url: string, email: string) => {
  const fileToSave = {
    primary_key: key,
    email,
    url,
  }

  await dynamoDB.put({
    TableName,
    Item: fileToSave,
}).promise();

  return fileToSave
}

const uploadImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const authData = retrieveAuthData(event)
  const email = authData?.username || ''
  const key = String(event.body.key)
  const url = String(event.body.url)

  try {
    const result = await saveFile(key, url, email)

    return formatJSONResponse({
      body: result,
    });
  } catch (error) {
    return sendResponse(400, error);
  }
};

export const main = middyfy(uploadImage);
