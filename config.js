const domainUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : '';
const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9000/' : '';
const apiUrl = serverUrl + 'api/';
const mongoUrl = process.env.NODE_ENV === 'development'
  ? 'mongodb://localhost:27017/skype'
  : '';

module.exports = {
  serverPort: 9000,
  domainUrl,
  serverUrl,
  apiUrl,
  mongoUrl,
  secretKey: 'd1wE15Upnnl9ZIHZmXUx4VMQCOckZxhIuQq9'
};
