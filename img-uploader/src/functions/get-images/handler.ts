import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { sendResponse } from "src/utils/sendResponse";
import { TableName } from "src/utils/const";
import { dynamoDB } from 'src/utils/providers';

const getImages = async (event: APIGatewayProxyEvent) => {
    const { limit, startKey } = event.queryStringParameters;

    const ExclusiveStartKey = {
        primary_key: startKey,
    }

    try {
        const images = await dynamoDB.scan({
            TableName,
            Limit: Number(limit) || 20,
            ...(startKey ? { ExclusiveStartKey }  : {})
        }).promise();
    
        return formatJSONResponse({
            body: images,
        });
    } catch (error) {
        return sendResponse(400, error);
    }
};

export const main = middyfy(getImages);
