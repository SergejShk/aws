const fibonachi = (n) => {
    if (n === 1 || n === 2) {
        return 1
    }

    return fibonachi(n - 1) + fibonachi(n - 2)
}

export const handler = async (event) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(fibonachi(10)),
    };
    return response;
};
