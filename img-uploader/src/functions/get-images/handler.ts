import { APIGatewayProxyEvent } from "aws-lambda";

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { sendResponse } from "src/utils/sendResponse";
import { TableName } from "src/utils/const";
import { dynamoDB } from 'src/utils/providers';
import { retrieveAuthData } from "src/utils/retrieveAuthData";

const getImages = async (event: APIGatewayProxyEvent) => {
    const startKey = event.queryStringParameters?.startKey || ''
    const limit = Number(event.queryStringParameters?.limit) || 20

    const authData = retrieveAuthData(event)
    const userName = authData?.username || ''

    const ExclusiveStartKey = {
        primary_key: startKey,
    }

    try {
        const images = await dynamoDB.scan({
            TableName,
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: { 
                ':email': userName,
            },
            Limit: limit || 20,
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
