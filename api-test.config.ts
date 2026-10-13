import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const processEnv = process.env.TEST_ENV;
const env = processEnv || "dev";

console.log(`Running tests in '${env}' environment`);

const config = {
  baseUrl: getRequiredEnv("BASE_URL"),
  userEmail: getRequiredEnv("USER_EMAIL"),
  userPassword: getRequiredEnv("USER_PASSWORD"),
};

export { config };
