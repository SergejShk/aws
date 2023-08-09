import { v4 as uuidv4 } from 'uuid';

import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import { sendResponse } from "src/utils/sendResponse";
import { BucketName } from 'src/utils/const';
import { s3 } from 'src/utils/providers';

const getPresignedData: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const body = event.body
    const fileName = body?.fileName || ''
  
    const params = {
        Bucket: BucketName,
        Fields: {
            key: fileName + uuidv4(),
            'Content-Type': 'image/jpg'
        },
        Expires: 300,
        Conditions: [
            ['starts-with', '$Content-Type', 'image/'], 
            ['content-length-range', 0, 10485760] 
        ]
    }

    try {
        const presignedPostData = await s3.createPresignedPost(params)

    return formatJSONResponse({
      body: presignedPostData,
    });
    } catch (error) {
      return sendResponse(400, error);
    }
  };
  
  export const main = middyfy(getPresignedData);
