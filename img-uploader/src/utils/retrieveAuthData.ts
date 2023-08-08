import jwt from 'jsonwebtoken';

export const retrieveAuthData = (event) => {
    const headers = event.headers;
    const token = headers.Authorization.split(" ")[1];

    return jwt.decode(token)
}
