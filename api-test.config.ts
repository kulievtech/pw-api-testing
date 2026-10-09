import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const processEnv = process.env.TEST_ENV;
const env = processEnv || "dev";

console.log(`Running tests in '${env}' environment`);

const config = {
  baseUrl: process.env.BASE_URL,
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD,
};

export { config };
