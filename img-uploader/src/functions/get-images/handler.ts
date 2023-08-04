import * as AWS from "aws-sdk";

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const dynamoDB = new AWS.DynamoDB.DocumentClient()

const getImages = async () => {
    const TableName = process.env.IMAGES_TABLE

    const images = await dynamoDB.scan({
        TableName: TableName,
        Limit: 20,
    }).promise();

  return formatJSONResponse({
    body: images,
  });
};

export const main = middyfy(getImages);
