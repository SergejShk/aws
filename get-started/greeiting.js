export const handler = async (event) => {
  const body = JSON.parse(event.body)
  const {name} = body
  
  const response = {
    statusCode: 200,
    body: JSON.stringify(`Hello ${name ? name : ''}!`),
  };
  return response;
};