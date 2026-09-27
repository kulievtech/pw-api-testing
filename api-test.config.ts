import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const env = process.env.TEST_ENV || "dev";

console.log(`Test Environment is: ${env}`);

const config = {
  baseUrl: requireEnv("BASE_URL"),
  userEmail: requireEnv("USER_EMAIL"),
  userPassword: requireEnv("USER_PASSWORD"),
};

export { config };
