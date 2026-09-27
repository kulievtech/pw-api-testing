import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";
import { config } from "../api-test.config";
import { createToken } from "../helpers/create-token";

type TestFixtures = {
  api: RequestHandler;
  config: typeof config;
};

type WorkerFixtures = {
  authToken: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  authToken: [
    async ({}, use) => {
      const token = await createToken(config.userEmail, config.userPassword);
      await use(token);
    },
    { scope: "worker" },
  ],

  api: async ({ request, authToken }, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const requestHandler = new RequestHandler(
      request,
      config.baseUrl,
      logger,
      authToken,
    );
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
  },
});
