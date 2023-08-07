import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from '@libs/lambda';

import { sendResponse } from "src/utils/sendResponse";

import schema from "./schema";
import { cognito } from "src/utils/providers";
import { UserPool } from "src/utils/const";

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const email = String(event.body.email)
    const password = String(event.body.password)

    try {
        const result = await cognito
            .adminCreateUser({
                UserPoolId: UserPool,
                Username: email,
                UserAttributes: [
                    {
                        Name: "email",
                        Value: email,
                    },
                    {
                        Name: "email_verified",
                        Value: "true",
                    },
                ],
                MessageAction: "SUPPRESS",
            })
            .promise();

        if (result.User) {
            await cognito
                .adminSetUserPassword({
                    Password: password,
                    UserPoolId: UserPool,
                    Username: email,
                    Permanent: true,
                })
                .promise();
        }

        return formatJSONResponse({ message: `User ${email} cerated successfully`});
    } catch (error) {
        return sendResponse(400, error);
    }
};

export const main = middyfy(register);
