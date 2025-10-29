export default () => ({
  APP_NAME: process.env.APP_NAME || 'NestJS APP',

  PORT: process.env.PORT || 5000,

  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs-auth',

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN',
  ACCESS_TOKEN_EXPIRATION_TIME:
    process.env.ACCESS_TOKEN_EXPIRATION_TIME || 900000,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN',
  REFRESH_TOKEN_EXPIRATION_TIME:
    process.env.REFRESH_TOKEN_EXPIRATION_TIME || 604800000,

  RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET || 'RESET_TOKEN',
  RESET_TOKEN_EXPIRATION_TIME:
    process.env.RESET_TOKEN_EXPIRATION_TIME || 86400000,

  MAIL_HOST: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  MAIL_PORT: process.env.MAIL_PORT || 2525,
  MAIL_USER: process.env.MAIL_USER || 'user',
  MAIL_PASS: process.env.MAIL_PASS || 'pass',
  MAIL_FROM: process.env.MAIL_FROM || 'No Reply',

  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'bucket-name',
  AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION || 'us-east-1',
  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY || 'access key',
  AWS_S3_SECRET_ACCESS_KEY:
    process.env.AWS_S3_SECRET_ACCESS_KEY || 'secret key',

  FRONTEND_RESET_PASSWORD_URL:
    process.env.FRONTEND_RESET_PASSWORD_URL ||
    'http://localhost:3000/auth/reset-password/',
});
