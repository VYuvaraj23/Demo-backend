import "dotenv/config";

const config = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,

  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME

};

export default config;