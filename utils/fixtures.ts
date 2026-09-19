import { test as base } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";

type TestFixtures = {
  api: RequestHandler;
};

export const test = base.extend<TestFixtures>({
  api: async ({ request }, use) => {
    const baseUrl = "https://conduit-api.bondaracademy.com/api";
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const requestHandler = new RequestHandler(request, baseUrl, logger);
    await use(requestHandler);
  },
});
