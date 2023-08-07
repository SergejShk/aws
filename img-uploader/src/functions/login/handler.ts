import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from '@libs/lambda';

import schema from "./schema";

import { sendResponse } from "src/utils/sendResponse";
import { cognito } from "src/utils/providers";
import { UserClientId, UserPool } from "src/utils/const";

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const email = String(event.body.email)
    const password = String(event.body.password)

    try {
        const response = await cognito
            .adminInitiateAuth({
                AuthFlow: "ADMIN_NO_SRP_AUTH",
                UserPoolId: UserPool,
                ClientId: UserClientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                },
            })
            .promise();

        return formatJSONResponse({ accessToken: response.AuthenticationResult.AccessToken });
    } catch (error) {
        return sendResponse(400, error);
    }
};

export const main = middyfy(login);