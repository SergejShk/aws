const helloName = async (event) => {
  const {name} = event.queryStringParameters;

  if (!name) {
    return {
      statusCode: 400,
      body: 'Invalid parameters',
    };
  }

  return {
    statusCode: 200,
    body: `Hello ${name}!`,
  };
};

module.exports = {
  handler: helloName,
}