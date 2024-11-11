function ApiResponse(statusCode, data, message = 'Success') {
    const response = {};
    response.statusCode = statusCode;
    response.data = data;
    response.message = message;
    response.success = statusCode < 400;
  
    return response;
  }
  
  export { ApiResponse };
  